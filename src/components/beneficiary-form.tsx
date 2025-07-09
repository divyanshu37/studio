
'use client';

import type { BeneficiaryFormValues } from '@/lib/schema';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn, formatPhoneNumber, formatDateInput } from '@/lib/utils';
import { usStates } from '@/lib/states';

const coverageOptions = [
  "$ 10,000", "$ 12,000", "$ 14,000", "$ 16,000", "$ 18,000", "$ 20,000", "$ 25,000"
];

const relationshipOptions = [
  "Aunt", "Brother", "Child", "Civil Union/Partner", "Cousin", "Dependent", 
  "Father", "Friend", "Grandfather", "Grandmother", "Guardian", "Mother", 
  "Parent", "Self", "Sister", "Spouse", "Stepbrother", "Stepfather", 
  "Stepmother", "Stepsister", "Uncle"
];

export default function BeneficiaryForm() {
  const { control, formState: { errors } } = useFormContext<BeneficiaryFormValues>();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    field.onChange(formatDateInput(e.target.value));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    field.onChange(formatPhoneNumber(e.target.value));
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      
      <FormField
        control={control}
        name="coverage"
        render={({ field }) => (
          <FormItem>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className={cn("h-auto py-4 bg-card shadow-xl text-base focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.coverage && "border-destructive focus-visible:border-destructive animate-shake")}>
                  <SelectValue placeholder="Select Coverage Amount" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {coverageOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormField
          control={control}
          name="applicantAddress"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Applicant's Primary Address" autoComplete="street-address" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.applicantAddress && "border-destructive focus-visible:border-destructive animate-shake")} />
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
                    <Input placeholder="Apt, suite, etc. (optional)" autoComplete="address-line2" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.applicantApt && "border-destructive focus-visible:border-destructive animate-shake")} />
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
                  <Input placeholder="City" autoComplete="address-level2" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.applicantCity && "border-destructive focus-visible:border-destructive animate-shake")} />
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
                  <Input placeholder="Zip Code" autoComplete="postal-code" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.applicantZip && "border-destructive focus-visible:border-destructive animate-shake")} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

       <div className="space-y-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={control}
            name="beneficiary1FirstName"
            render={({ field }) => (
                <FormItem>
                <FormControl>
                    <Input placeholder="Beneficiary First Name" autoComplete="off" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1FirstName && "border-destructive focus-visible:border-destructive animate-shake")} />
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
                    <Input placeholder="Beneficiary Last Name" autoComplete="off" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1LastName && "border-destructive focus-visible:border-destructive animate-shake")} />
                </FormControl>
                </FormItem>
            )}
            />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={control}
            name="beneficiaryMobile"
            render={({ field }) => (
                <FormItem>
                <FormControl>
                    <Input 
                        placeholder="Beneficiary Mobile (Optional)" 
                        autoComplete="off" 
                        {...field} 
                        onChange={(e) => handlePhoneChange(e, field)}
                        className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiaryMobile && "border-destructive focus-visible:border-destructive animate-shake")} />
                </FormControl>
                </FormItem>
            )}
            />
            <FormField
            control={control}
            name="beneficiaryDob"
            render={({ field }) => (
                <FormItem>
                <FormControl>
                    <Input 
                        placeholder="Beneficiary Birthdate (Optional)" 
                        autoComplete="off" 
                        {...field} 
                        onChange={(e) => handleDateChange(e, field)}
                        className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiaryDob && "border-destructive focus-visible:border-destructive animate-shake")} />
                </FormControl>
                </FormItem>
            )}
            />
        </div>

        <div className="grid grid-cols-1 gap-4">
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
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <FormField
          control={control}
          name="effectiveDate"
          render={({ field }) => (
            <FormItem>
                <FormControl>
                <Input 
                  type="text"
                  placeholder="Desired effective date of this policy"
                  autoComplete="off"
                  {...field}
                  onChange={(e) => handleDateChange(e, field)}
                  className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.effectiveDate && "border-destructive focus-visible:border-destructive animate-shake")} 
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
