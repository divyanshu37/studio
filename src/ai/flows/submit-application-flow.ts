
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

// 1. Define the input from the form. This is the raw data.
const SubmitApplicationInputSchema = fullFormSchema.extend({
  referenceId: z.string().uuid(),
});
export type SubmitApplicationInput = z.infer<typeof SubmitApplicationInputSchema>;

// 2. Define the exact shape the API expects.
const ApplicantDataSchema = z.object({
  referenceId: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  addressStreet: z.string(),
  addressCity: z.string(),
  addressState: z.string(),
  addressZip: z.string(),
  dob: z.string(), // Formatted as MM/DD/YYYY
  phone: z.string(), // Formatted as digits only
  lastFour: z.string(),
  gender: z.string(),
  beneficiaryFirstName: z.string(),
  beneficiaryLastName: z.string(),
  beneficiaryDob: z.string(), // Formatted as MM/DD/YYYY
  beneficiaryAddressStreet: z.string(),
  beneficiaryAddressCity: z.string(),
  beneficiaryAddressState: z.string(),
  beneficiaryAddressZip: z.string(),
  beneficiaryPhone: z.string(), // Formatted as digits only
  beneficiaryRelation: z.string(),
  beneficiaryPercentage: z.string(),
  faceAmount: z.string(),
  paymentAccountHolderName: z.string(),
  paymentRoutingNumber: z.string(),
  paymentAccountNumber: z.string(),
});
type ApplicantData = z.infer<typeof ApplicantDataSchema>;

// 3. Create the dedicated, pure transformation function.
function transformDataForApi(formData: SubmitApplicationInput): ApplicantData {
  const formatDate = (dateString: string) => {
    // Input format from <input type="date"> is YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    const [year, month, day] = dateString.split('-');
    const formatted = `${month}/${day}/${year}`;
    return formatted;
  };

  const formatPhone = (phoneString: string) => {
    // Remove all non-digit characters
    const formatted = phoneString.replace(/\D/g, '');
    return formatted;
  };

  const capitalize = (s: string) => {
    if (typeof s !== 'string' || s.length === 0) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const transformedData: ApplicantData = {
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
    beneficiaryPercentage: "100", // Hardcoded as per original logic
    faceAmount: formData.coverage.replace(/[^0-9]/g, ''),
    paymentAccountHolderName: formData.accountHolderName,
    paymentRoutingNumber: formData.routingNumber,
    paymentAccountNumber: formData.accountNumber,
  };
  
  // This is the "test" that validates the data *after* transformation.
  // If it fails, something is wrong with the transformation logic, and it will throw an error.
  return ApplicantDataSchema.parse(transformedData);
}

// 4. Define the output of the flow.
const SubmitApplicationOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  policyId: z.string().optional(),
});
export type SubmitApplicationOutput = z.infer<typeof SubmitApplicationOutputSchema>;

// 5. Public-facing function remains the same.
export async function submitApplication(input: SubmitApplicationInput): Promise<SubmitApplicationOutput> {
  return submitApplicationFlow(input);
}

// 6. The flow itself is now much simpler.
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

    try {
      // Step 1: Transform the data using our new, reliable function.
      const applicantData = transformDataForApi(formData);
      
      // Step 2: Send it to the backend.
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
        const errorMessage = error.response.data.message || 'API submission failed.';
        return { success: false, message: Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage };
      }
      
      // This will catch Zod errors from the transform function as well.
      if (error instanceof z.ZodError) {
        console.error('Data transformation failed:', error.flatten());
        return { success: false, message: 'Data transformation failed. Please check the inputs.' };
      }

      console.error('API submission error:', error);
      return { success: false, message: 'Failed to connect to the server.' };
    }
  }
);
