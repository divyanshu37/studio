
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
      message: "Invalid date. Please use MM/DD/YYYY format.",
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

export const additionalQuestionsFormSchema = z.object({
  differentOwner: z.string().min(1, { message: "Please select an option." }),
  healthQuestion1: z.string().min(1, { message: "This question is required." }),
  healthQuestion2: z.string().min(1, { message: "This question is required." }),
  healthQuestion3: z.string().min(1, { message: "This question is required." }),
  tobaccoUse: z.string().min(1, { message: 'This question is required.' }),
  existingPolicies: z.string().min(1, { message: 'This question is required.' }),
  otherHealthIssues: z.string().min(1, { message: 'This question is required.' }),
  otherHealthIssuesDetails: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.otherHealthIssues === 'yes' && (!data.otherHealthIssuesDetails || data.otherHealthIssuesDetails.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['otherHealthIssuesDetails'],
      message: 'Please provide details about your other health issues.',
    });
  }
});
export type AdditionalQuestionsFormValues = z.infer<typeof additionalQuestionsFormSchema>;

export const beneficiaryFormSchema = z.object({
  effectiveDate: z.string()
    .min(10, { message: "Please enter a complete effective date." })
    .refine((date) => isValid(parse(date, 'MM/dd/yyyy', new Date())), {
      message: "Invalid date. Please use MM/DD/YYYY format.",
    })
    .refine((date) => {
        const parsedDate = parse(date, 'MM/dd/yyyy', new Date());
        if (!isValid(parsedDate)) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return parsedDate >= today;
    }, {
        message: "Effective date must be today or a future date."
    }),
  applicantAddress: z.string().min(1, { message: "Address is required." }),
  applicantApt: z.string().optional(),
  applicantCity: z.string().min(1, { message: "City is required." }),
  applicantState: z.string().length(2, { message: "State must be a 2-letter abbreviation." }),
  applicantZip: z.string().regex(/^\d{5}$/, { message: "Zip code must be 5 digits." }),
  beneficiary1FirstName: z.string().min(1, { message: "First name is required." }),
  beneficiary1LastName: z.string().min(1, { message: "Last name is required." }),
  beneficiary1Relationship: z.string().min(1, { message: "Relationship is required." }),
});
export type BeneficiaryFormValues = z.infer<typeof beneficiaryFormSchema>;

export const paymentFormSchema = z.object({
  coverage: z.string().min(1, { message: "Coverage amount is required." }),
  accountHolderName: z.string().min(1, { message: "Account holder name is required." }),
  accountNumber: z.string().min(1, { message: "Account number is required." }),
  routingNumber: z.string().length(9, { message: "A valid 9-digit routing number is required." }),
  ssn: z.string().length(4, { message: "Please enter the last 4 digits of your SSN." }),
});
export type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export const fullFormSchema = insuranceFormSchema
  .merge(additionalQuestionsFormSchema)
  .merge(beneficiaryFormSchema)
  .merge(paymentFormSchema);

export type FormValues = z.infer<typeof fullFormSchema>;
