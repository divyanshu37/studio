
import { z } from 'zod';
import { differenceInYears, parse, isValid } from 'date-fns';

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

export const beneficiaryFormSchema = z.object({
  applicantAddress: z.string().min(1, { message: "Address is required." }),
  applicantApt: z.string().optional(),
  applicantCity: z.string().min(1, { message: "City is required." }),
  applicantState: z.string().length(2, { message: "State must be a 2-letter abbreviation." }),
  applicantZip: z.string().regex(/^\d{5}$/, { message: "Zip code must be 5 digits." }),
  beneficiary1FirstName: z.string().min(1, { message: "First name is required." }),
  beneficiary1LastName: z.string().min(1, { message: "Last name is required." }),
  beneficiaryMobile: z.string().optional(),
  beneficiaryDob: z.string().optional().refine((dob) => {
    if (!dob || dob === "") return true; // Optional field is valid if empty
    // If a value is present, it must be a complete and valid date
    return dob.length === 10 && isValid(parse(dob, 'MM/dd/yyyy', new Date()));
  }, {
    message: "Invalid date. Please use MM/dd/yyyy format.",
  }),
  beneficiary1Relationship: z.string().min(1, { message: "Relationship is required." }),
  coverage: z.string().min(1, { message: "Coverage amount is required." }),
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
  accountHolderName: z.string().min(1, { message: "Account holder name is required." }),
  accountNumber: z.string().min(1, { message: "Account number is required." }),
  routingNumber: z.string().length(9, { message: "A valid 9-digit routing number is required." }),
  lastFour: z.string().length(4, { message: "Please enter the last 4 digits of your SSN." }),
});
export type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export const fullFormSchema = insuranceFormSchema
 .merge(additionalQuestionsObjectSchema)
 .merge(beneficiaryFormSchema)
 .merge(paymentFormSchema);

export type FormValues = z.infer<typeof fullFormSchema>;
