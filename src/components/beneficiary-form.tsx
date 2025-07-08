
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
  beneficiary1Address: z.string().min(1, { message: "Address is required." }),
  beneficiary1Apt: z.string().optional(),
  beneficiary1City: z.string().min(1, { message: "City is required." }),
  beneficiary1State: z.string().min(1, { message: "State is required." }),
  beneficiary1Zip: z.string().min(5, { message: "A valid zip code is required." }),
});

export type BeneficiaryFormValues = z.infer<typeof beneficiaryFormSchema>;

export default function BeneficiaryForm() {
  const { control, formState: { errors } } = useFormContext<BeneficiaryFormValues>();

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="space-y-4">
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
      </div>
      
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-foreground text-left pt-4">Primary Address</h3>
        <FormField
          control={control}
          name="beneficiary1Address"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Street Address" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1Address && "border-destructive focus-visible:border-destructive animate-shake")} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <FormField
              control={control}
              name="beneficiary1Apt"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Apt, suite, etc. (optional)" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1Apt && "border-destructive focus-visible:border-destructive animate-shake")} />
                  </FormControl>
                </FormItem>
              )}
            />
          <FormField
            control={control}
            name="beneficiary1City"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="City" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1City && "border-destructive focus-visible:border-destructive animate-shake")} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="beneficiary1State"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="State" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1State && "border-destructive focus-visible:border-destructive animate-shake")} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="beneficiary1Zip"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Zip Code" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1Zip && "border-destructive focus-visible:border-destructive animate-shake")} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
