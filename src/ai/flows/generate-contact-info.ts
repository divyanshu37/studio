'use server';

/**
 * @fileOverview An AI agent for generating personalized contact information.
 *
 * - generateContactInfo - A function that generates contact information based on role and availability.
 * - GenerateContactInfoInput - The input type for the generateContactInfo function.
 * - GenerateContactInfoOutput - The return type for the generateContactInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateContactInfoInputSchema = z.object({
  role: z.string().describe('The role of the contact (e.g., administrator, support, sales).'),
  availability: z
    .string()
    .describe(
      'The availability of the contact, including days and hours available (e.g., Monday-Friday, 9am-5pm).' // Corrected grammar here
    ),
});
export type GenerateContactInfoInput = z.infer<typeof GenerateContactInfoInputSchema>;

const GenerateContactInfoOutputSchema = z.object({
  name: z.string().describe('The full name of the contact.'),
  email: z.string().email().describe('The email address of the contact.'),
  phone: z.string().describe('The phone number of the contact.'),
  bio: z.string().describe('A short biography of the contact.'),
});

export type GenerateContactInfoOutput = z.infer<typeof GenerateContactInfoOutputSchema>;

export async function generateContactInfo(
  input: GenerateContactInfoInput
): Promise<GenerateContactInfoOutput> {
  return generateContactInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContactInfoPrompt',
  input: {schema: GenerateContactInfoInputSchema},
  output: {schema: GenerateContactInfoOutputSchema},
  prompt: `You are an AI assistant specializing in generating contact information for various roles within a company.

  Given the role and availability provided, generate realistic and professional contact details, including name, email, phone, and a short bio.

  Role: {{{role}}}
  Availability: {{{availability}}}

  Ensure the generated information is appropriate and suitable for public display on a company website.
  Do not make up names of real people. All names should be fictitious.
  Email addresses should use the domain example.com.
  Phone numbers should start with a +1 country code.
  Do not return any personal information of real people.
  `,
});

const generateContactInfoFlow = ai.defineFlow(
  {name: 'generateContactInfoFlow', inputSchema: GenerateContactInfoInputSchema, outputSchema: GenerateContactInfoOutputSchema},
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
