'use server';
/**
 * @fileOverview A flow to submit lead data to the backend.
 *
 * - submitLead - A function that handles the lead submission.
 * - SubmitLeadInput - The input type for the submitLead function.
 * - SubmitLeadOutput - The return type for the submitLead function.
 */

import {ai} from '@/ai/genkit';
import {fullFormSchema, type FormValues} from '@/lib/schema';
import {z} from 'zod';
import axios from 'axios';

// We can reuse the full form schema for input, as we'll have all the data up to this point.
// We make it partial because fields from later steps won't be filled yet.
const SubmitLeadInputSchema = fullFormSchema.partial();
export type SubmitLeadInput = z.infer<typeof SubmitLeadInputSchema>;

const SubmitLeadOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type SubmitLeadOutput = z.infer<typeof SubmitLeadOutputSchema>;

export async function submitLead(
  formData: SubmitLeadInput
): Promise<SubmitLeadOutput> {
  return submitLeadFlow(formData);
}

const submitLeadFlow = ai.defineFlow(
  {
    name: 'submitLeadFlow',
    inputSchema: SubmitLeadInputSchema,
    outputSchema: SubmitLeadOutputSchema,
  },
  async (formData) => {
    const leadUrl = process.env.LEAD_URL;

    if (!leadUrl) {
      // For development, we can log this, but we won't block the user from proceeding.
      console.log('LEAD_URL not set. Skipping lead submission.');
      return {success: true, message: 'Skipped lead submission.'};
    }

    try {
      // Unlike the final submission, we can send the data as-is.
      // If a specific format is needed later, we can add a transformation function.
      await axios.post(leadUrl, formData);
      return {success: true, message: 'Lead submitted successfully.'};
    } catch (error) {
      let errorMessage = 'An unknown error occurred during lead submission.';
      if (axios.isAxiosError(error) && error.response) {
        errorMessage =
          error.response.data?.message || 'API submission failed.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('Lead submission failed:', errorMessage);
      // We return success=false but this won't be shown to the user, it will just be logged.
      return {success: false, message: errorMessage};
    }
  }
);
