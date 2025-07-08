
import { z } from 'zod';
import { differenceInYears, parse, isValid } from 'date-fns';

const isValidSsn = (ssn: string) => {
    const ssnParts = ssn.replace(/-/g, '');
    if (ssnParts.length !== 9) return true;

    const area = ssnParts.substring(0, 3);
    const group = ssnParts.substring(3, 5);
    const serial = ssnParts.substring(5, 9);
    
    if (area === "000" || area === "666" || parseInt(area, 10) >= 900) {
        return false;
    }
    if (group === "00") {
        return false;
    }
    if (serial === "0000") {
        return false;
    }
    return true;
};

export const insuranceFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  phone: z.string().min(14, { message: "Please enter a complete phone number." }),
  email: z.string().min(1, { message: "Email is required." }).email({ message: "Invalid email address." }),
  dob: z.string()
    .min(1, { message: "Date of birth is required." })
    .refine((dob) => isValid(parse(dob, 'yyyy-MM-dd', new Date())), {
      message: "Invalid date format.",
    })
    .refine((dob) => {
        const parsedDate = parse(dob, 'yyyy-MM-dd', new Date());
        if (!isValid(parsedDate)) return false;
        const age = differenceInYears(new Date(), parsedDate);
        return age >= 45 && age <= 80;
    }, {
        message: "You must be between 45 and 80 years old to be eligible."
    }),
  ssn: z.string()
    .min(11, { message: "Please enter a complete social security number." })
    .refine(isValidSsn, {
        message: "Please enter a valid social security number."
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
});
export type AdditionalQuestionsFormValues = z.infer<typeof additionalQuestionsFormSchema>;

export const beneficiaryFormSchema = z.object({
  effectiveDate: z.string()
    .min(1, { message: "An effective date is required." })
    .refine((date) => isValid(parse(date, 'yyyy-MM-dd', new Date())), {
      message: "Invalid effective date.",
    })
    .refine((date) => {
        const [year, month, day] = date.split('-').map(Number);
        const parsedDate = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return parsedDate >= today;
    }, {
        message: "Effective date must be today or a future date."
    }),
  applicantAddress: z.string().min(1, { message: "Address is required." }),
  applicantApt: z.string().optional(),
  applicantCity: z.string().min(1, { message: "City is required." }),
  applicantState: z.string().min(1, { message: "State is required." }),
  applicantZip: z.string().min(5, { message: "A valid zip code is required." }),
});
export type BeneficiaryFormValues = z.infer<typeof beneficiaryFormSchema>;

export const beneficiaryAddressFormSchema = z.object({
  beneficiary1FirstName: z.string().min(1, { message: "First name is required." }),
  beneficiary1LastName: z.string().min(1, { message: "Last name is required." }),
  beneficiary1Dob: z.string().min(1, { message: "Date of birth is required." }).refine((dob) => isValid(parse(dob, 'yyyy-MM-dd', new Date())), {
    message: "Invalid date of birth.",
  }),
  beneficiary1Relationship: z.string().min(1, { message: "Relationship is required." }),
  beneficiary1Phone: z.string().min(14, { message: "Please enter a complete phone number." }),
  beneficiaryAddress: z.string().min(1, { message: "Beneficiary address is required." }),
  beneficiaryApt: z.string().optional(),
  beneficiaryCity: z.string().min(1, { message: "Beneficiary city is required." }),
  beneficiaryState: z.string().min(1, { message: "Beneficiary state is required." }),
  beneficiaryZip: z.string().min(5, { message: "A valid beneficiary zip code is required." }),
});
export type BeneficiaryAddressFormValues = z.infer<typeof beneficiaryAddressFormSchema>;

export const paymentFormSchema = z.object({
  coverage: z.string().min(1, { message: "Coverage amount is required." }),
  accountHolderName: z.string().min(1, { message: "Account holder name is required." }),
  accountNumber: z.string().min(1, { message: "Account number is required." }),
  routingNumber: z.string().min(9, { message: "A valid 9-digit routing number is required." }).max(9, { message: "A valid 9-digit routing number is required." }),
});
export type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export const fullFormSchema = insuranceFormSchema
  .merge(additionalQuestionsFormSchema)
  .merge(beneficiaryFormSchema)
  .merge(beneficiaryAddressFormSchema)
  .merge(paymentFormSchema);

export type FormValues = z.infer<typeof fullFormSchema>;
