
import { z } from 'zod';
import { differenceInYears, parse, isValid, format } from 'date-fns';

export const insuranceFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  phone: z.string().min(14, { message: "Please enter a complete phone number." }),
  email: z.string().min(1, { message: "Email is required." }).email({ message: "Invalid email address." }),
  dob: z.string()
    .min(10, { message: "Please enter a complete date of birth." })
    .refine((dob) => isValid(parse(dob, 'MM/dd/yyyy', new Date())), {
      message: "Invalid date. Please use MM/dd/yyyy format.",
    })
    .refine((dob) => {
        const parsedDate = parse(dob, 'MM/dd/yyyy', new Date());
        if (!isValid(parsedDate)) return false;
        const age = differenceInYears(new Date(), parsedDate);
        return age >= 45 && age <= 80;
    }, {
        message: "You must be between 45 and 80 years old to be eligible."
    }),
  gender: z.string().min(1, { message: "Please select a gender." }),
});
export type InsuranceFormValues = z.infer<typeof insuranceFormSchema>;

export const additionalQuestionsObjectSchema = z.object({
  differentOwner: z.string().min(1, { message: "Please select an option." }),
  healthQuestion1: z.string().min(1, { message: "This question is required." }),
  healthQuestion2: z.string().min(1, { message: "This question is required." }),
  healthQuestion3: z.string().min(1, { message: "This question is required." }),
  tobaccoUse: z.string().min(1, { message: 'This question is required.' }),
  existingPolicies: z.string().min(1, { message: 'This question is required.' }),
  otherHealthIssues: z.string().min(1, { message: 'This question is required.' }),
  otherHealthIssuesDetails: z.string().optional(),
});
export type AdditionalQuestionsFormValues = z.infer<typeof additionalQuestionsObjectSchema>;


export const beneficiaryFormSchema = z.object({
  addressStreet: z.string().min(1, { message: "Address is required." }),
  addressApt: z.string().optional(),
  addressCity: z.string().min(1, { message: "City is required." }),
  addressState: z.string().length(2, { message: "State must be a 2-letter abbreviation." }),
  addressZip: z.string().regex(/^\d{5}$/, { message: "Zip code must be 5 digits." }),
  beneficiaryFirstName: z.string().min(1, { message: "First name is required." }),
  beneficiaryLastName: z.string().min(1, { message: "Last name is required." }),
  beneficiaryPhone: z.string().optional(),
  beneficiaryDob: z.string().optional().refine((dob) => {
    if (!dob || dob === "") return true; // Optional field is valid if empty
    // If a value is present, it must be a complete and valid date
    return dob.length === 10 && isValid(parse(dob, 'MM/dd/yyyy', new Date()));
  }, {
    message: "Invalid date. Please use MM/dd/yyyy format.",
  }),
  beneficiaryRelation: z.string().min(1, { message: "Relationship is required." }),
  faceAmount: z.string().min(1, { message: "Coverage amount is required." }),
  effectiveDate: z.string().optional().refine((date) => {
    if (!date || date === "") return true; // Optional field
    if (date.length !== 10) return false; // Must be full date if entered
    const parsedDate = parse(date, 'MM/dd/yyyy', new Date());
    if (!isValid(parsedDate)) return false; // Must be a valid date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return parsedDate >= today; // Must be today or future
  }, {
    message: "Date must be valid (MM/dd/yyyy) and not in the past.",
  }),
});
export type BeneficiaryFormValues = z.infer<typeof beneficiaryFormSchema>;

export const paymentFormSchema = z.object({
  paymentAccountHolderName: z.string().min(1, { message: "Account holder name is required." }),
  paymentAccountNumber: z.string().min(1, { message: "Account number is required." }),
  paymentRoutingNumber: z.string().length(9, { message: "A valid 9-digit routing number is required." }),
  lastFour: z.string().length(4, { message: "Please enter the last 4 digits of your SSN." }),
});
export type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export const fullFormSchema = insuranceFormSchema
 .merge(additionalQuestionsObjectSchema)
 .merge(beneficiaryFormSchema)
 .merge(paymentFormSchema);

export type FormValues = z.infer<typeof fullFormSchema>;


// Centralized API Payload Logic

// 1. Define the FLAT payload schema that the API expects.
export const FinalPayloadSchema = z.object({
  referenceId: z.string().uuid().optional(),
  email: z.string().email().optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  addressStreet: z.string().min(1).optional(),
  addressCity: z.string().min(1).optional(),
  addressState: z.string().length(2).optional(),
  addressZip: z.string().regex(/^\d{5}$/).optional(),
  dob: z.string().optional(), // Formatted as MM/dd/yyyy
  phone: z.string().optional(), // Digits only
  lastFour: z.string().regex(/^\d{4}$/).optional(), // Last 4 of SSN
  gender: z.string().optional(),
  beneficiaryFirstName: z.string().min(1).optional(),
  beneficiaryLastName: z.string().min(1).optional(),
  beneficiaryRelation: z.string().min(1).optional(),
  beneficiaryDob: z.string().optional(), // Formatted as MM/dd/yyyy
  beneficiaryPhone: z.string().optional(), // Digits only
  beneficiaryPercentage: z.string().optional(),
  faceAmount: z.string().optional(),
  paymentAccountHolderName: z.string().min(1).optional(),
  paymentRoutingNumber: z.string().length(9).optional(),
  paymentAccountNumber: z.string().min(1).optional(),
  // Health and Policy Questions
  differentOwner: z.string().optional(),
  healthQuestion1: z.string().optional(),
  healthQuestion2: z.string().optional(),
  healthQuestion3: z.string().optional(),
  tobaccoUse: z.string().optional(),
  existingPolicies: z.string().optional(),
  otherHealthIssues: z.string().optional(),
  otherHealthIssuesDetails: z.string().optional(),
  effectiveDate: z.string().optional(), // Formatted as MM/dd/yyyy
}).partial(); // Make all fields optional to handle partial form data
export type FinalPayload = z.infer<typeof FinalPayloadSchema>;


// 2. Create the dedicated, pure transformation function to build the FLAT payload.
export function transformDataForApi(formData: Partial<FormValues>): FinalPayload {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString) && !/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return dateString;
    if (dateString.includes('/')) return dateString; // Already in MM/dd/yyyy
    const [year, month, day] = dateString.split('-');
    const formatted = `${month}/${day}/${year}`;
    return formatted;
  };
  
  const formatEffectiveDate = (dateString?: string) => {
    if (dateString) {
      return formatDate(dateString);
    }
    return format(new Date(), 'MM/dd/yyyy');
  };

  const formatPhone = (phoneString?: string) => {
    if (!phoneString) return '';
    return phoneString.replace(/\D/g, '');
  };

  const capitalize = (s?: string) => {
    if (!s || s.length === 0) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  
  const getFullStreet = (street?: string, apt?: string) => {
    if (!street) return '';
    if (apt && apt.trim() !== '') {
      return `${street}, ${apt}`;
    }
    return street;
  };

  const rawData: Record<string, any> = {
    referenceId: (formData as any).referenceId, // For final submission
    email: formData.email || '',
    firstName: formData.firstName || '',
    lastName: formData.lastName || '',
    addressStreet: getFullStreet(formData.addressStreet, formData.addressApt) || '',
    addressCity: formData.addressCity || '',
    addressState: formData.addressState || '',
    addressZip: formData.addressZip || '',
    dob: formatDate(formData.dob) || '',
    phone: formatPhone(formData.phone) || '',
    lastFour: formData.lastFour || '',
    gender: capitalize(formData.gender) || '',
    beneficiaryFirstName: formData.beneficiaryFirstName || '',
    beneficiaryLastName: formData.beneficiaryLastName || '',
    beneficiaryDob: formatDate(formData.beneficiaryDob) || '',
    beneficiaryPhone: formatPhone(formData.beneficiaryPhone) || '',
    beneficiaryRelation: formData.beneficiaryRelation || '',
    beneficiaryPercentage: "100",
    faceAmount: formData.faceAmount ? formData.faceAmount.replace(/[^0-9]/g, '') : '',
    paymentAccountHolderName: formData.paymentAccountHolderName || '',
    paymentRoutingNumber: formData.paymentRoutingNumber || '',
    paymentAccountNumber: formData.paymentAccountNumber || '',
    differentOwner: formData.differentOwner || 'no',
    healthQuestion1: formData.healthQuestion1 || 'no',
    healthQuestion2: formData.healthQuestion2 || 'no',
    healthQuestion3: formData.healthQuestion3 || 'no',
    tobaccoUse: formData.tobaccoUse || 'no',
    existingPolicies: formData.existingPolicies || 'no',
    otherHealthIssues: formData.otherHealthIssues || 'no',
    otherHealthIssuesDetails: formData.otherHealthIssuesDetails || '',
    effectiveDate: formatEffectiveDate(formData.effectiveDate),
  };
  
  return FinalPayloadSchema.parse(rawData);
}

// 3. Create a dedicated transformation for the LEAD API call.
export function transformDataForLeadApi(formData: Partial<FormValues>): Omit<FinalPayload, 'paymentAccountHolderName' | 'paymentRoutingNumber' | 'paymentAccountNumber' | 'lastFour'> {
  // First, get the fully transformed payload
  const fullPayload = transformDataForApi(formData);
  
  // Then, destructure to remove the payment fields.
  const { 
    paymentAccountHolderName, 
    paymentRoutingNumber, 
    paymentAccountNumber, 
    lastFour, 
    ...leadPayload // The rest of the object is what we want
  } = fullPayload;

  return leadPayload;
}
