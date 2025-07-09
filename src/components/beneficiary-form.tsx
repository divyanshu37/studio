
'use client';

import type { BeneficiaryFormValues } from '@/lib/schema';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { usStates } from '@/lib/states';

export default function BeneficiaryForm() {
  const { control, formState: { errors } } = useFormContext<BeneficiaryFormValues>();

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="space-y-4">
        <FormField
          control={control}
          name="effectiveDate"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2 text-left">
              <FormLabel className="text-base font-semibold text-foreground">Desired effective date of this policy</FormLabel>
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
        <h3 className="text-base font-semibold text-foreground text-left pt-4">Applicant's Primary Address</h3>
        <FormField
          control={control}
          name="applicantAddress"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Street Address" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.applicantAddress && "border-destructive focus-visible:border-destructive animate-shake")} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <FormField
              control={control}
              name="applicantApt"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Apt, suite, etc. (optional)" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.applicantApt && "border-destructive focus-visible:border-destructive animate-shake")} />
                  </FormControl>
                </FormItem>
              )}
            />
          <FormField
            control={control}
            name="applicantCity"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="City" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.applicantCity && "border-destructive focus-visible:border-destructive animate-shake")} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="applicantState"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={cn("h-auto py-4 bg-card shadow-xl text-base focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.applicantState && "border-destructive focus-visible:border-destructive animate-shake")}>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {usStates.map(state => (
                      <SelectItem key={state.abbreviation} value={state.abbreviation}>{state.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="applicantZip"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Zip Code" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.applicantZip && "border-destructive focus-visible:border-destructive animate-shake")} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
