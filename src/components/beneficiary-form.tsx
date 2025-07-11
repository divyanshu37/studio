
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
      
      <div className="space-y-4">
        <FormField
          control={control}
          name="addressStreet"
          render={({ field }) => (
            <FormItem>
              <FormControl className={cn(errors.addressStreet && 'animate-shake')}>
                <Input placeholder="Applicant's Primary Address" autoComplete="street-address" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.addressStreet && "border-destructive focus-visible:border-destructive")} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <FormField
              control={control}
              name="addressApt"
              render={({ field }) => (
                <FormItem>
                  <FormControl className={cn(errors.addressApt && 'animate-shake')}>
                    <Input placeholder="Apt, suite, etc. (optional)" autoComplete="address-line2" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.addressApt && "border-destructive focus-visible:border-destructive animate-shake")} />
                  </FormControl>
                </FormItem>
              )}
            />
          <FormField
            control={control}
            name="addressCity"
            render={({ field }) => (
              <FormItem>
                <FormControl className={cn(errors.addressCity && 'animate-shake')}>
                  <Input placeholder="City" autoComplete="address-level2" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.addressCity && "border-destructive focus-visible:border-destructive animate-shake")} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="addressState"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value} >
                  <FormControl>
                    <SelectTrigger className={cn("h-auto py-4 bg-card shadow-xl text-base focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.addressState && "border-destructive focus-visible:border-destructive animate-shake")}>
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
            name="addressZip"
            render={({ field }) => (
              <FormItem>
                <FormControl className={cn(errors.addressZip && 'animate-shake')}>
                  <Input placeholder="Zip Code" autoComplete="postal-code" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.addressZip && "border-destructive focus-visible:border-destructive animate-shake")} />
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
            name="beneficiaryFirstName"
            render={({ field }) => (
                <FormItem>
                <FormControl className={cn(errors.beneficiaryFirstName && 'animate-shake')}>
                    <Input placeholder="Beneficiary First Name" autoComplete="off" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiaryFirstName && "border-destructive focus-visible:border-destructive animate-shake")} />
                </FormControl>
                </FormItem>
            )}
            />
            <FormField
            control={control}
            name="beneficiaryLastName"
            render={({ field }) => (
                <FormItem>
                <FormControl className={cn(errors.beneficiaryLastName && 'animate-shake')}>
                    <Input placeholder="Beneficiary Last Name" autoComplete="off" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiaryLastName && "border-destructive focus-visible:border-destructive animate-shake")} />
                </FormControl>
                </FormItem>
            )}
            />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={control}
            name="beneficiaryPhone"
            render={({ field }) => (
                <FormItem>
                <FormControl className={cn(errors.beneficiaryPhone && 'animate-shake')}>
                    <Input 
                        placeholder="Beneficiary Mobile (Optional)" 
                        autoComplete="off" 
                        {...field} 
                        onChange={(e) => handlePhoneChange(e, field)}
                        className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiaryPhone && "border-destructive focus-visible:border-destructive animate-shake")} />
                </FormControl>
                </FormItem>
            )}
            />
            <FormField
            control={control}
            name="beneficiaryDob"
            render={({ field }) => (
                <FormItem>
                <FormControl className={cn(errors.beneficiaryDob && 'animate-shake')}>
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
            name="beneficiaryRelation"
            render={({ field }) => (
                <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value} >
                    <FormControl>
                    <SelectTrigger className={cn("h-auto py-4 bg-card shadow-xl text-base focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiaryRelation && "border-destructive focus-visible:border-destructive animate-shake")}>
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

      <div className="space-y-4 pt-8">
        <FormField
          control={control}
          name="faceAmount"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value} >
                <FormControl>
                  <SelectTrigger className={cn("h-auto py-4 bg-card shadow-xl text-base focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.faceAmount && "border-destructive focus-visible:border-destructive animate-shake")}>
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
        <FormField
          control={control}
          name="effectiveDate"
          render={({ field }) => (
            <FormItem>
                <FormControl className={cn(errors.effectiveDate && 'animate-shake')}>
                <Input 
                  type="text"
                  placeholder="Policy Start Date (Default Today)"
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
