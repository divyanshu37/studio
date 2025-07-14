
'use server';
/**
 * @fileOverview A flow to submit lead data to the backend.
 *
 * - submitLead - A function that handles the lead submission.
 * - SubmitLeadInput - The input type for the submitLead function.
 * - SubmitLeadOutput - The return type for the submitLead function.
 */

import {ai} from '@/ai/genkit';
import {transformDataForLeadApi} from '@/lib/schema';
import {z} from 'zod';
import axios from 'axios';

// The input can be any part of the form, so we use z.any() here.
// The real validation happens in transformDataForLeadApi.
const SubmitLeadInputSchema = z.any();
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
      // Use the dedicated transformation function for lead submission.
      // This will strip out payment fields before sending.
      const finalPayload = transformDataForLeadApi(formData);
      await axios.post(leadUrl, finalPayload);
      return {success: true, message: 'Lead submitted successfully.'};
    } catch (error) {
      let errorMessage = 'An unknown error occurred during lead submission.';
      if (axios.isAxiosError(error) && error.response) {
        // Log the detailed error from the API response if available
        const apiErrors = error.response.data?.errors || error.response.data?.message;
        errorMessage = `API submission failed: ${JSON.stringify(apiErrors) || error.message}`;
      } else if (error instanceof z.ZodError) {
        errorMessage = `Data validation failed before sending: ${JSON.stringify(error.flatten())}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('Lead submission failed:', errorMessage);
      console.error('Provided data:', JSON.stringify(formData));
      // We return success=false but this won't be shown to the user, it will just be logged.
      return {success: false, message: errorMessage};
    }
  }
);
