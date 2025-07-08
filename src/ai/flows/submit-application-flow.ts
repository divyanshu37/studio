
'use server';
/**
 * @fileOverview A flow to submit the insurance application to the backend.
 *
 * - submitApplication - A function that handles the application submission.
 * - SubmitApplicationInput - The input type for the submitApplication function.
 * - SubmitApplicationOutput - The return type for the submitApplication function.
 */

import {ai} from '@/ai/genkit';
import { fullFormSchema, type FormValues } from '@/lib/schema';
import { z } from 'zod';

const SubmitApplicationInputSchema = fullFormSchema.extend({
  uuid: z.string().uuid(),
});
export type SubmitApplicationInput = z.infer<typeof SubmitApplicationInputSchema>;

const SubmitApplicationOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  policyId: z.string().optional(),
});
export type SubmitApplicationOutput = z.infer<typeof SubmitApplicationOutputSchema>;

export async function submitApplication(input: SubmitApplicationInput): Promise<SubmitApplicationOutput> {
  return submitApplicationFlow(input);
}

const submitApplicationFlow = ai.defineFlow(
  {
    name: 'submitApplicationFlow',
    inputSchema: SubmitApplicationInputSchema,
    outputSchema: SubmitApplicationOutputSchema,
  },
  async (applicationData) => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      console.error('BACKEND_URL environment variable is not set.');
      return { success: false, message: 'Server configuration error.' };
    }

    try {
      const response = await fetch(`${backendUrl}/insurance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API submission failed:', response.status, errorData);
        return { success: false, message: errorData.message || 'API submission failed.' };
      }

      const result = await response.json();

      return {
        success: true,
        message: 'Application submitted successfully!',
        policyId: result.policyId,
      };
    } catch (error) {
      console.error('API submission error:', error);
      return { success: false, message: 'Failed to connect to the server.' };
    }
  }
);
