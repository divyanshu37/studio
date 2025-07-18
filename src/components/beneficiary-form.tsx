
'use client';

import { useState } from 'react';
import type { BeneficiaryFormValues } from '@/lib/schema';
import { useFormContext } from 'react-hook-form';
import { format } from "date-fns";
import {
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn, formatPhoneNumber, formatDateInput } from '@/lib/utils';
import AddressAutocomplete from './address-autocomplete';

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
  const [isCalendarOpen, setCalendarOpen] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    field.onChange(formatDateInput(e.target.value));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    field.onChange(formatPhoneNumber(e.target.value));
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      
      <div className="space-y-4">
        <AddressAutocomplete />
         <FormField
          control={control}
          name="addressApt"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Secondary (Apartment or Mailbox)"
                  autoComplete="address-line2"
                  {...field}
                  className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.addressApt && "border-destructive focus-visible:border-destructive animate-shake")}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      {/* Hidden fields for validation, populated by AddressAutocomplete */}
      <FormField control={control} name="addressStreet" render={({ field }) => <FormItem><FormControl><Input type="hidden" {...field} /></FormControl></FormItem>} />
      <FormField control={control} name="addressCity" render={({ field }) => <FormItem><FormControl><Input type="hidden" {...field} /></FormControl></FormItem>} />
      <FormField control={control} name="addressState" render={({ field }) => <FormItem><FormControl><Input type="hidden" {...field} /></FormControl></FormItem>} />
      <FormField control={control} name="addressZip" render={({ field }) => <FormItem><FormControl><Input type="hidden" {...field} /></FormControl></FormItem>} />


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
            <FormItem className="flex flex-col">
              <Popover open={isCalendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 justify-start text-left font-normal text-base",
                        !field.value && "text-muted-foreground",
                        errors.effectiveDate && "border-destructive focus-visible:border-destructive animate-shake"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "MM/dd/yyyy")
                      ) : (
                        <span>Policy Start Date (Default Today)</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      field.onChange(date ? format(date, "MM/dd/yyyy") : "");
                      setCalendarOpen(false);
                    }}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
