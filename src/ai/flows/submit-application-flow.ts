
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
const SubmitApplicationInputSchema = fullFormSchema
  .extend({
    referenceId: z.string().uuid(),
  })
  .superRefine((data, ctx) => {
    if (
      data.otherHealthIssues === 'yes' &&
      (!data.otherHealthIssuesDetails || data.otherHealthIssuesDetails.trim() === '')
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['otherHealthIssuesDetails'],
        message: 'Please provide details about your other health issues.',
      });
    }
  });
export type SubmitApplicationInput = z.infer<typeof SubmitApplicationInputSchema>;


// 2. Define the FLAT payload schema that the webhook's `customData` expects.
const FinalPayloadSchema = z.object({
  referenceId: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  addressStreet: z.string().min(1),
  addressCity: z.string().min(1),
  addressState: z.string().length(2),
  addressZip: z.string().regex(/^\d{5}$/),
  dob: z.string(), // Formatted as MM/dd/yyyy
  phone: z.string(), // Digits only
  lastFour: z.string().regex(/^\d{4}$/), // Last 4 of SSN
  gender: z.string(),
  beneficiaryFirstName: z.string().min(1),
  beneficiaryLastName: z.string().min(1),
  beneficiaryRelation: z.string().min(1),
  beneficiaryDob: z.string(), // Formatted as MM/dd/yyyy
  beneficiaryPhone: z.string(), // Digits only
  beneficiaryPercentage: z.string(),
  faceAmount: z.string(),
  paymentAccountHolderName: z.string().min(1),
  paymentRoutingNumber: z.string().length(9),
  paymentAccountNumber: z.string().min(1),
});
type FinalPayload = z.infer<typeof FinalPayloadSchema>;


// 3. Create the dedicated, pure transformation function to build the FLAT payload.
function transformDataForApi(formData: SubmitApplicationInput): FinalPayload {
  const formatDate = (dateString: string) => {
    // Input format from <input type="date"> is YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString) && !/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return dateString;
    if (dateString.includes('/')) return dateString; // Already in MM/dd/yyyy
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
    if (apt && apt.trim() !== '') {
      return `${street}, ${apt}`;
    }
    return street;
  };

  const transformedData: FinalPayload = {
    referenceId: formData.referenceId,
    email: formData.email,
    firstName: formData.firstName,
    lastName: formData.lastName,
    addressStreet: getFullStreet(formData.applicantAddress, formData.applicantApt),
    addressCity: formData.applicantCity,
    addressState: formData.applicantState,
    addressZip: formData.applicantZip,
    dob: formatDate(formData.dob),
    phone: formatPhone(formData.phone),
    lastFour: formData.lastFour,
    gender: capitalize(formData.gender),
    beneficiaryFirstName: formData.beneficiary1FirstName,
    beneficiaryLastName: formData.beneficiary1LastName,
    beneficiaryDob: formData.beneficiaryDob ? formatDate(formData.beneficiaryDob) : '',
    beneficiaryPhone: formData.beneficiaryMobile ? formatPhone(formData.beneficiaryMobile) : '',
    beneficiaryRelation: formData.beneficiary1Relationship,
    beneficiaryPercentage: "100",
    faceAmount: formData.coverage.replace(/[^0-9]/g, ''),
    paymentAccountHolderName: formData.accountHolderName,
    paymentRoutingNumber: formData.routingNumber,
    paymentAccountNumber: formData.accountNumber,
  };
  
  // This validates the data *after* transformation against our flat schema.
  return FinalPayloadSchema.parse(transformedData);
}

// 4. Define the output of the flow. A policyId is not returned by the async webhook.
const SubmitApplicationOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type SubmitApplicationOutput = z.infer<typeof SubmitApplicationOutputSchema>;

// 5. Public-facing function remains the same.
export async function submitApplication(formData: SubmitApplicationInput): Promise<SubmitApplicationOutput> {
  if (!formData) {
    return { success: false, message: 'Invalid application data provided.' };
  }
  return submitApplicationFlow(formData);
}

// 6. The flow itself is now updated to send the correct flat structure nested in `customData`.
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
      return { success: false, message: 'Server configuration error: Missing backend URL.' };
    }
     if (!apiKey) {
      return { success: false, message: 'Server configuration error: Missing API Key.' };
    }

    try {
      // Transform the form data into the flat payload the webhook expects.
      const finalPayload = transformDataForApi(formData);
      
      const response = await axios.post(
        `${backendUrl}/insurance`, 
        finalPayload,
        { headers: { 'insurance-api-key': apiKey } }
      );
      
      const result = response.data;
      // If we get a 2xx status, the webhook accepted the request.
      // The actual processing result will come via WebSocket.
      if (response.status >= 200 && response.status < 300) {
        return {
          success: true,
          message: 'Application submitted successfully! Waiting for backend processing.',
        };
      } else {
        const errorMessage = result?.message || 'Backend rejected the request.';
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

      console.error(error);
      console.error('An unknown error occurred during submission:', error);
      return { success: false, message: 'Failed to connect to the server.' };
    }
  }
);
