
'use client';

import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { parse, isValid } from 'date-fns';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn, formatPhoneNumber } from '@/lib/utils';

const relationshipOptions = [
  "Aunt", "Brother", "Child", "Civil Union/Partner", "Cousin", "Dependent", 
  "Father", "Friend", "Grandfather", "Grandmother", "Guardian", "Mother", 
  "Parent", "Self", "Sister", "Spouse", "Stepbrother", "Stepfather", 
  "Stepmother", "Stepsister", "Uncle"
];

export const beneficiaryAddressFormSchema = z.object({
  beneficiary1FirstName: z.string().min(1, { message: "First name is required." }),
  beneficiary1LastName: z.string().min(1, { message: "Last name is required." }),
  beneficiary1Dob: z.string().min(1, { message: "Date of birth is required." }).refine((dob) => isValid(parse(dob, 'yyyy-MM-dd', new Date())), {
    message: "Invalid date of birth.",
  }),
  beneficiary1Relationship: z.string().min(1, { message: "Relationship is required." }),
  beneficiary1Phone: z.string().min(14, { message: "Please enter a complete phone number." }),
  contingentBeneficiaryCount: z.coerce.number().min(0, { message: "Please enter a number." }).int(),
});

export type BeneficiaryAddressFormValues = z.infer<typeof beneficiaryAddressFormSchema>;

export default function BeneficiaryAddressForm() {
  const { control, formState: { errors } } = useFormContext<BeneficiaryAddressFormValues>();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    field.onChange(formatPhoneNumber(e.target.value));
  };

  return (
    <div className="w-full max-w-2xl space-y-4">
      <h3 className="text-base font-semibold text-foreground text-left">Primary Beneficiary 1</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="beneficiary1FirstName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Beneficiary First Name" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1FirstName && "border-destructive focus-visible:border-destructive animate-shake")} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="beneficiary1LastName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Beneficiary Last Name" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1LastName && "border-destructive focus-visible:border-destructive animate-shake")} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="beneficiary1Dob"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date of Birth</FormLabel>
            <FormControl>
              <Input
                type="date"
                {...field}
                className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1Dob && "border-destructive focus-visible:border-destructive animate-shake")}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <h3 className="text-base font-semibold text-foreground text-left pt-4">Primary Beneficiary 1 Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="beneficiary1Relationship"
          render={({ field }) => (
            <FormItem>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className={cn("h-auto py-4 bg-card shadow-xl text-base focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1Relationship && "border-destructive focus-visible:border-destructive animate-shake")}>
                    <SelectValue placeholder="Relationship to Insured" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {relationshipOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="beneficiary1Phone"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Mobile Number" {...field} onChange={(e) => handlePhoneChange(e, field)} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1Phone && "border-destructive focus-visible:border-destructive animate-shake")} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="contingentBeneficiaryCount"
        render={({ field }) => (
          <FormItem>
            <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || '')} value={isNaN(field.value) ? '' : field.value} placeholder="How many contingent beneficiaries?" className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.contingentBeneficiaryCount && "border-destructive focus-visible:border-destructive animate-shake")} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
