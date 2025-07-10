'use server';
/**
 * @fileOverview A flow to submit application lead data to the backend.
 *
 * - submitApplicationLead - A function that handles the application lead submission.
 * - SubmitApplicationLeadInput - The input type for the submitApplicationLead function.
 * - SubmitApplicationLeadOutput - The return type for the submitApplicationLead function.
 */

import {ai} from '@/ai/genkit';
import {fullFormSchema} from '@/lib/schema';
import {z} from 'zod';
import axios from 'axios';

// We use a partial schema because not all fields might be relevant,
// but we will receive all of them up to this point.
const SubmitApplicationLeadInputSchema = fullFormSchema.partial();
export type SubmitApplicationLeadInput = z.infer<typeof SubmitApplicationLeadInputSchema>;

const SubmitApplicationLeadOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type SubmitApplicationLeadOutput = z.infer<typeof SubmitApplicationLeadOutputSchema>;

export async function submitApplicationLead(
  formData: SubmitApplicationLeadInput
): Promise<SubmitApplicationLeadOutput> {
  return submitApplicationLeadFlow(formData);
}

const submitApplicationLeadFlow = ai.defineFlow(
  {
    name: 'submitApplicationLeadFlow',
    inputSchema: SubmitApplicationLeadInputSchema,
    outputSchema: SubmitApplicationLeadOutputSchema,
  },
  async (formData) => {
    const applicationLeadUrl = process.env.APPLICATION_LEAD_URL;

    if (!applicationLeadUrl) {
      // Log for development, but don't block the user.
      console.log('APPLICATION_LEAD_URL not set. Skipping application lead submission.');
      return {success: true, message: 'Skipped application lead submission.'};
    }

    try {
      // The data is sent as-is.
      await axios.post(applicationLeadUrl, formData);
      return {success: true, message: 'Application lead submitted successfully.'};
    } catch (error) {
      let errorMessage = 'An unknown error occurred during application lead submission.';
      if (axios.isAxiosError(error) && error.response) {
        errorMessage =
          error.response.data?.message || 'API submission failed.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('Application lead submission failed:', errorMessage);
      // We return success=false, but this is a background task and won't be shown to the user.
      return {success: false, message: errorMessage};
    }
  }
);
