
'use server';
/**
 * @fileOverview A flow to submit the insurance application to the backend.
 *
 * - submitApplication - A function that handles the application submission.
 * - SubmitApplicationInput - The input type for the submitApplication function.
 * - SubmitApplicationOutput - The return type for the submitApplication function.
 */

import {ai} from '@/ai/genkit';
import { fullFormSchema } from '@/lib/schema';
import { z } from 'zod';
import axios from 'axios';

const SubmitApplicationInputSchema = fullFormSchema.extend({
  referenceId: z.string().uuid(),
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
  async (formData) => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      console.error('BACKEND_URL environment variable is not set.');
      return { success: false, message: 'Server configuration error.' };
    }

    const formatDate = (dateString: string) => {
      // The date from <input type="date"> is YYYY-MM-DD
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
      const [year, month, day] = dateString.split('-');
      return `${month}/${day}/${year}`; // Format to MM/DD/YYYY
    };

    const formatPhone = (phoneString: string) => {
      // Remove all non-digit characters
      return phoneString.replace(/\D/g, '');
    };

    const capitalize = (s: string) => {
      if (typeof s !== 'string' || s.length === 0) return '';
      return s.charAt(0).toUpperCase() + s.slice(1);
    };

    const applicantData = {
      referenceId: formData.referenceId,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      addressStreet: formData.applicantAddress,
      addressCity: formData.applicantCity,
      addressState: formData.applicantState,
      addressZip: formData.applicantZip,
      dob: formatDate(formData.dob),
      phone: formatPhone(formData.phone),
      lastFour: formData.ssn.replace(/-/g, '').slice(-4),
      gender: capitalize(formData.gender),
      beneficiaryFirstName: formData.beneficiary1FirstName,
      beneficiaryLastName: formData.beneficiary1LastName,
      beneficiaryDob: formatDate(formData.beneficiary1Dob),
      beneficiaryAddressStreet: formData.beneficiaryAddress,
      beneficiaryAddressCity: formData.beneficiaryCity,
      beneficiaryAddressState: formData.beneficiaryState,
      beneficiaryAddressZip: formData.beneficiaryZip,
      beneficiaryPhone: formatPhone(formData.beneficiary1Phone),
      beneficiaryRelation: formData.beneficiary1Relationship,
      beneficiaryPercentage: "100",
      faceAmount: formData.coverage.replace(/[^0-9]/g, ''),
      paymentAccountHolderName: formData.accountHolderName,
      paymentRoutingNumber: formData.routingNumber,
      paymentAccountNumber: formData.accountNumber,
    };

    try {
      console.log('Submitting to API:', applicantData);
      const response = await axios.post(`${backendUrl}insurance`, applicantData);
      const result = response.data;

      return {
        success: true,
        message: 'Application submitted successfully!',
        policyId: result.policyId,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('API submission failed:', error.response.status, error.response.data);
        const errorMessage = error.response.data.message || 'API submission failed.';
        return { success: false, message: Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage };
      }
      
      console.error('API submission error:', error);
      return { success: false, message: 'Failed to connect to the server.' };
    }
  }
);
