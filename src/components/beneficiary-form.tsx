
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
import { cn } from '@/lib/utils';

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
  beneficiaryCount: z.coerce.number().min(1, { message: 'Please enter a number.' }).int(),
  beneficiary1FirstName: z.string().min(1, { message: "First name is required." }),
  beneficiary1LastName: z.string().min(1, { message: "Last name is required." }),
  beneficiary1Dob: z.string().min(1, { message: "Date of birth is required." }).refine((dob) => isValid(parse(dob, 'yyyy-MM-dd', new Date())), {
    message: "Invalid date of birth.",
  }),
});

export type BeneficiaryFormValues = z.infer<typeof beneficiaryFormSchema>;

export default function BeneficiaryForm() {
  const { control, formState: { errors } } = useFormContext<BeneficiaryFormValues>();

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <FormField
            control={control}
            name="effectiveDate"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-2">
                <FormLabel className="text-left text-base font-semibold text-foreground">Desired effective date of this policy</FormLabel>
                 <FormControl>
                  <Input 
                    type="date"
                    {...field} 
                    className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.effectiveDate && "border-destructive focus-visible:border-destructive animate-shake")} 
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="beneficiaryCount"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || '')} value={isNaN(field.value) ? '' : field.value} placeholder="How many primary beneficiaries?" className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiaryCount && "border-destructive focus-visible:border-destructive animate-shake")} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      
        <h3 className="text-base font-semibold text-foreground text-left pt-4">Primary Beneficiary 1</h3>
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
      </div>
    </div>
  );
}
