
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

// 1. Define the input from the form. This is the raw data from the UI.
const SubmitApplicationInputSchema = fullFormSchema.extend({
  referenceId: z.string().uuid(),
});
export type SubmitApplicationInput = z.infer<typeof SubmitApplicationInputSchema>;

// 2. Define the exact NESTED shape the backend's `customData` object expects.
const AddressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().length(2),
  zip: z.string().regex(/^\d{5}$/),
});

const BeneficiarySchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dob: z.string(), // Formatted as MM/DD/YYYY
  address: AddressSchema,
  phone: z.string(), // Formatted as digits only
  relation: z.string().min(1),
  percentage: z.string(),
});

const PaymentSchema = z.object({
    accountHolderName: z.string().min(1),
    accountHolderPhone: z.string(), // Digits only
    routingNumber: z.string().length(9),
    accountNumber: z.string().min(1),
});

const FinalPayloadSchema = z.object({
  referenceId: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  state: z.string().length(2),
  address: AddressSchema,
  dob: z.string(), // Formatted as MM/DD/YYYY
  phone: z.string(), // Digits only
  lastFour: z.string().length(4),
  gender: z.string(),
  beneficiary: BeneficiarySchema,
  faceAmount: z.string(),
  payment: PaymentSchema,
});
type FinalPayload = z.infer<typeof FinalPayloadSchema>;


// 3. Create the dedicated, pure transformation function.
function transformDataForApi(formData: SubmitApplicationInput): FinalPayload {
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
  
  const getFullStreet = (street: string, apt?: string) => {
    if (!apt || apt.trim() === '') {
      return street;
    }
    // Simple check to avoid duplication if user enters street again in apt field
    if (apt.trim() !== '' && !street.toLowerCase().includes(apt.toLowerCase())) {
        return `${street}, ${apt}`;
    }
    return street;
  };

  const transformedData: FinalPayload = {
    referenceId: formData.referenceId,
    email: formData.email,
    firstName: formData.firstName,
    lastName: formData.lastName,
    state: formData.applicantState,
    address: {
      street: getFullStreet(formData.applicantAddress, formData.applicantApt),
      city: formData.applicantCity,
      state: formData.applicantState,
      zip: formData.applicantZip,
    },
    dob: formatDate(formData.dob),
    phone: formatPhone(formData.phone),
    lastFour: formData.ssn.replace(/-/g, '').slice(-4),
    gender: capitalize(formData.gender),
    beneficiary: {
      firstName: formData.beneficiary1FirstName,
      lastName: formData.beneficiary1LastName,
      dob: formatDate(formData.beneficiary1Dob),
      address: {
        street: getFullStreet(formData.beneficiaryAddress, formData.beneficiaryApt),
        city: formData.beneficiaryCity,
        state: formData.beneficiaryState,
        zip: formData.beneficiaryZip,
      },
      phone: formatPhone(formData.beneficiary1Phone),
      relation: formData.beneficiary1Relationship,
      percentage: "100",
    },
    faceAmount: formData.coverage.replace(/[^0-9]/g, ''),
    payment: {
      accountHolderName: formData.accountHolderName,
      accountHolderPhone: formatPhone(formData.phone), // Mapping applicant's phone
      routingNumber: formData.routingNumber,
      accountNumber: formData.accountNumber,
    },
  };
  
  // This is the "test" that validates the data *after* transformation.
  // If it fails, something is wrong with the transformation logic, and it will throw an error.
  return FinalPayloadSchema.parse(transformedData);
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

// 6. The flow itself is now updated to send the correct nested structure.
const submitApplicationFlow = ai.defineFlow(
  {
    name: 'submitApplicationFlow',
    inputSchema: SubmitApplicationInputSchema,
    outputSchema: SubmitApplicationOutputSchema,
  },
  async (formData) => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const apiKey = process.env.INSURANCE_API_KEY;

    if (!backendUrl) {
      console.error('BACKEND_URL environment variable is not set.');
      return { success: false, message: 'Server configuration error: Missing backend URL.' };
    }
     if (!apiKey) {
      console.error('INSURANCE_API_KEY environment variable is not set.');
      return { success: false, message: 'Server configuration error: Missing API Key.' };
    }

    try {
      // The backend expects the data to be nested inside a `customData` object.
      // However, the final schema is a different one. We now transform to a new payload.
      const finalPayload = transformDataForApi(formData);
      
      const response = await axios.post(
        `${backendUrl}/insurance-webhook`, 
        { customData: finalPayload }, // Nesting the final transformed payload
        { headers: { 'insurance-api-key': apiKey } }
      );
      
      const result = response.data;
      if (response.status >= 200 && response.status < 300 && (result?.success || result?.policyId)) {
        return {
          success: true,
          message: 'Application submitted successfully!',
          policyId: result.policyId,
        };
      } else {
        const errorMessage = result?.message || 'Backend processed the request, but the submission was not successful.';
        return {
          success: false,
          message: Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage,
        };
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data?.message || 'API submission failed.';
        return { success: false, message: Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage };
      }
      
      if (error instanceof z.ZodError) {
        const flattenedErrors = error.flatten();
        const errorMessages = Object.entries(flattenedErrors.fieldErrors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('; ');
        return { success: false, message: `Data validation failed: ${errorMessages}` || 'Invalid data provided.' };
      }

      console.error('An unknown error occurred during submission:', error);
      return { success: false, message: 'Failed to connect to the server.' };
    }
  }
);
