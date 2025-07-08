'use server';
/**
 * @fileOverview A flow to submit the insurance application.
 *
 * - submitApplication - A function that handles the application submission.
 * - FormValues - The input type for the submitApplication function.
 */

import {ai} from '@/ai/genkit';
import { fullFormSchema, type FormValues } from '@/lib/schema';
import { z } from 'zod';

const SubmitApplicationOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  policyId: z.string().optional(),
});
export type SubmitApplicationOutput = z.infer<typeof SubmitApplicationOutputSchema>;

export async function submitApplication(input: FormValues): Promise<SubmitApplicationOutput> {
  return submitApplicationFlow(input);
}

const submitApplicationFlow = ai.defineFlow(
  {
    name: 'submitApplicationFlow',
    inputSchema: fullFormSchema,
    outputSchema: SubmitApplicationOutputSchema,
  },
  async (applicationData) => {
    // Here would be the logic to submit the data to an external API.
    // For now, we'll just log it and return a success response.
    console.log('Application data received in flow:', applicationData);

    // This is where you would make your API call.
    // For example:
    // const response = await fetch('https://api.example.com/submit', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(applicationData),
    // });
    // if (!response.ok) {
    //   return { success: false, message: 'API submission failed.' };
    // }
    // const result = await response.json();

    return {
      success: true,
      message: 'Application submitted successfully!',
      policyId: `POL-${Date.now()}`,
    };
  }
);
