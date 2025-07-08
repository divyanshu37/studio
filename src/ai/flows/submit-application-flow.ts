
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
import axios from 'axios';

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

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface Beneficiary {
  firstName: string;
  lastName: string;
  dob: string;
  address: Address;
  phone: string;
  relation: string;
  percentage: string;
}

export interface ApplicantData {
  referenceId: string;
  email: string;
  firstName: string;
  lastName: string;
  address: Address;
  dob: string;
  phone: string;
  lastFour: string;
  gender: string;
  beneficiary: Beneficiary;
  faceAmount: string;
  accountHolderName: string;
  routingNumber: string;
  accountNumber: string;
}

export async function submitApplication(input: SubmitApplicationInput): Promise<SubmitApplicationOutput> {
  return submitApplicationFlow(input);
}

const submitApplicationFlow = ai.defineFlow(
  {
    name: 'submitApplicationFlow',
    inputSchema: SubmitApplicationInputSchema,
    outputSchema: SubmitApplicationOutputSchema,
  },
  async (formData) => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      console.error('BACKEND_URL environment variable is not set.');
      return { success: false, message: 'Server configuration error.' };
    }

    // Transform flat form data into the nested structure required by the API
    const applicantData: ApplicantData = {
      referenceId: formData.uuid,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: {
        street: formData.applicantAddress,
        city: formData.applicantCity,
        state: formData.applicantState,
        zip: formData.applicantZip,
      },
      dob: formData.dob,
      phone: formData.phone,
      lastFour: formData.ssn.replace(/-/g, '').slice(-4),
      gender: formData.gender,
      beneficiary: {
        firstName: formData.beneficiary1FirstName,
        lastName: formData.beneficiary1LastName,
        dob: formData.beneficiary1Dob,
        address: {
          street: formData.beneficiaryAddress,
          city: formData.beneficiaryCity,
          state: formData.beneficiaryState,
          zip: formData.beneficiaryZip,
        },
        phone: formData.beneficiary1Phone,
        relation: formData.beneficiary1Relationship,
        percentage: '100', // Assuming a single beneficiary gets 100%
      },
      faceAmount: formData.coverage.replace(/[^0-9]/g, ''),
      accountHolderName: formData.accountHolderName,
      routingNumber: formData.routingNumber,
      accountNumber: formData.accountNumber,
    };

    try {
      const response = await axios.post(`${backendUrl}/insurance`, applicantData);
      const result = response.data;

      return {
        success: true,
        message: 'Application submitted successfully!',
        policyId: result.policyId,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('API submission failed:', error.response.status, error.response.data);
        return { success: false, message: error.response.data.message || 'API submission failed.' };
      }
      
      console.error('API submission error:', error);
      return { success: false, message: 'Failed to connect to the server.' };
    }
  }
);
