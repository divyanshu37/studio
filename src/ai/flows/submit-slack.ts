
'use server';
/**
 * @fileOverview A flow to submit a notification to a Slack webhook.
 *
 * - submitToSlack - A function that handles the Slack submission.
 * - SubmitToSlackInput - The input type for the submitToSlack function.
 * - SubmitToSlackOutput - The return type for the submitToSlack function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import axios from 'axios';
import { getSlackMessage } from '@/lib/slack';

const SubmitToSlackInputSchema = z.object({
  step: z.string(),
  formData: z.any(),
});
export type SubmitToSlackInput = z.infer<typeof SubmitToSlackInputSchema>;

const SubmitToSlackOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type SubmitToSlackOutput = z.infer<typeof SubmitToSlackOutputSchema>;

export async function submitToSlack(
  input: SubmitToSlackInput
): Promise<SubmitToSlackOutput> {
  return submitToSlackFlow(input);
}

const submitToSlackFlow = ai.defineFlow(
  {
    name: 'submitToSlackFlow',
    inputSchema: SubmitToSlackInputSchema,
    outputSchema: SubmitToSlackOutputSchema,
  },
  async ({ step, formData }) => {
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!slackWebhookUrl) {
      // Log for development, but don't block the user.
      console.log('SLACK_WEBHOOK_URL not set. Skipping Slack notification.');
      return {success: true, message: 'Skipped Slack notification.'};
    }

    try {
      const slackMessage = getSlackMessage(step, formData);
      const payload = { text: slackMessage };
      
      await axios.post(slackWebhookUrl, payload);
      return {success: true, message: 'Slack notification sent successfully.'};
    } catch (error) {
      let errorMessage = 'An unknown error occurred during Slack submission.';
      if (axios.isAxiosError(error)) {
        errorMessage = `Slack API error: ${error.response?.data?.message || error.message}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('Slack notification failed:', errorMessage);
      // We return success=false, but this is a background task and won't be shown to the user.
      return {success: false, message: errorMessage};
    }
  }
);
