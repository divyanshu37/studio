
'use server';
/**
 * @fileOverview A flow to submit the insurance application to the backend.
 *
 * - submitApplication - A function that handles the application submission.
 * - SubmitApplicationInput - The input type for the submitApplication function.
 * - SubmitApplicationOutput - The return type for the submitApplication function.
 */

import {ai} from '@/ai/genkit';
import { FormValues, fullFormSchema, transformDataForApi } from '@/lib/schema';
import { z } from 'zod';
import axios from 'axios';

// 1. Define the input from the form. This is the raw data from the UI.
const SubmitApplicationInputSchema = fullFormSchema
  .extend({
    referenceId: z.string().uuid(),
  })
  .superRefine((data, ctx) => {
    if (
      data.otherHealthIssues === 'yes' &&
      (!data.otherHealthIssuesDetails || data.otherHealthIssuesDetails.trim() === '')
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['otherHealthIssuesDetails'],
        message: 'Please provide details about your other health issues.',
      });
    }
  });
export type SubmitApplicationInput = z.infer<typeof SubmitApplicationInputSchema>;

// 2. Define the output of the flow. A policyId is not returned by the async webhook.
const SubmitApplicationOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type SubmitApplicationOutput = z.infer<typeof SubmitApplicationOutputSchema>;

// 3. Public-facing function remains the same.
export async function submitApplication(formData: SubmitApplicationInput): Promise<SubmitApplicationOutput> {
  if (!formData) {
    return { success: false, message: 'Invalid application data provided.' };
  }
  return submitApplicationFlow(formData);
}

// 4. The flow itself is now updated to send the correct flat structure.
const submitApplicationFlow = ai.defineFlow(
  {
    name: 'submitApplicationFlow',
    inputSchema: SubmitApplicationInputSchema,
    outputSchema: SubmitApplicationOutputSchema,
  },
  async (formData) => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3400';
    const apiKey = process.env.INSURANCE_API_KEY;

    if (!backendUrl) {
      return { success: false, message: 'Server configuration error: Missing backend URL.' };
    }
     if (!apiKey) {
      return { success: false, message: 'Server configuration error: Missing INSURANCE_API_KEY.' };
    }

    try {
      // Transform the form data into the flat payload the webhook expects.
      const finalPayload = transformDataForApi(formData);
      
      const response = await axios.post(
        `${backendUrl}/insurance`, 
        finalPayload,
        { headers: { 'insurance-api-key': apiKey } }
      );
      
      const result = response.data;
      // If we get a 2xx status, the webhook accepted the request.
      // The actual processing result will come via WebSocket.
      if (response.status >= 200 && response.status < 300) {
        return {
          success: true,
          message: 'Application submitted successfully! Waiting for backend processing.',
        };
      } else {
        const errorMessage = result?.message || 'Backend rejected the request.';
        return {
          success: false,
          message: Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage,
        };
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data?.message || 'API submission failed.';
        return { success: false, message: Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage };
      }
      
      if (error instanceof z.ZodError) {
        const flattenedErrors = error.flatten();
        const errorMessages = Object.entries(flattenedErrors.fieldErrors)
            .map(([field, messages]) => `${field}: ${(messages as any).join(', ')}`)
            .join('; ');
        return { success: false, message: `Data validation failed: ${errorMessages}` || 'Invalid data provided.' };
      }

      console.error(error);
      console.error('An unknown error occurred during submission:', error);
      return { success: false, message: 'Failed to connect to the server.' };
    }
  }
);
