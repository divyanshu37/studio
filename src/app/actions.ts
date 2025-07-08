'use server';
import { generateContactInfo, GenerateContactInfoInput, GenerateContactInfoOutput } from '@/ai/flows/generate-contact-info';

export async function getAIContactInfo(data: GenerateContactInfoInput): Promise<GenerateContactInfoOutput> {
  // Adding a delay to simulate network latency for better UX feel
  await new Promise(resolve => setTimeout(resolve, 1000));
  try {
    const result = await generateContactInfo(data);
    return result;
  } catch (error) {
    console.error('Error generating contact info:', error);
    throw new Error('Failed to generate contact information. Please try again.');
  }
}
