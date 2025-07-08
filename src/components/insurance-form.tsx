'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { differenceInYears, parse, isValid } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import FormNavigation from '@/components/form-navigation';
import { cn, formatPhoneNumber, formatDateInput, formatSsn } from '@/lib/utils';

const isValidSsn = (ssn: string) => {
    const ssnParts = ssn.replace(/-/g, '');
    if (ssnParts.length !== 9) return true; // Let min validation handle length, we only care about structure here.

    const area = ssnParts.substring(0, 3);
    const group = ssnParts.substring(3, 5);
    const serial = ssnParts.substring(5, 9);
    
    // More robust validation based on SSA rules to better catch fakes.
    // Area number cannot be 000, 666, or in the 900-999 range.
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

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  phone: z.string().min(14, { message: "Please enter a complete phone number." }),
  email: z.string().min(1, { message: "Email is required." }).email({ message: "Invalid email address." }),
  dob: z.string()
    .min(10, { message: "Please enter a complete date of birth." })
    .refine((dob) => {
        const parsedDate = parse(dob, 'MM/dd/yyyy', new Date());
        if (!isValid(parsedDate)) return false;

        const [month, day, year] = dob.split('/').map(Number);
        if (parsedDate.getFullYear() !== year || parsedDate.getMonth() !== month - 1 || parsedDate.getDate() !== day) {
            return false;
        }

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
});

export type InsuranceFormValues = z.infer<typeof formSchema>;

interface InsuranceFormProps {
  onNext: (data: InsuranceFormValues) => void;
}

export default function InsuranceForm({ onNext }: InsuranceFormProps) {
  const form = useForm<InsuranceFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      dob: '',
      ssn: '',
    },
  });

  const { formState: { errors } } = form;
  const [ssnValidationState, setSsnValidationState] = useState<'idle' | 'validating' | 'valid'>('idle');
  const ssnValue = form.watch('ssn');

  useEffect(() => {
    const rawSsn = ssnValue.replace(/[^\d]/g, '');

    if (rawSsn.length < 9) {
      setSsnValidationState('idle');
      if (errors.ssn?.type === 'manual') {
        form.clearErrors('ssn');
      }
      return;
    }

    if (rawSsn.length === 9) {
      setSsnValidationState('validating');
      const timer = setTimeout(() => {
        if (isValidSsn(ssnValue)) {
          setSsnValidationState('valid');
          if (errors.ssn) {
            form.clearErrors('ssn');
          }
        } else {
          setSsnValidationState('idle');
          form.setError('ssn', { type: 'manual', message: 'Please enter a valid social security number.' });
        }
      }, 1000); // Simulate network latency

      return () => clearTimeout(timer);
    }
  }, [ssnValue, form, errors.ssn]);


  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    field.onChange(formatPhoneNumber(e.target.value));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    field.onChange(formatDateInput(e.target.value));
  };

  const handleSSNChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    field.onChange(formatSsn(e.target.value));
  };

  function getErrorMessage() {
    if (ssnValidationState === 'validating') return "One moment, validating SSN...";
    if (ssnValidationState === 'valid') return "SSN validated";
    if (errors.dob?.message) return errors.dob.message;
    if (errors.ssn?.message) return errors.ssn.message;
    if (Object.keys(errors).length > 0) return "Red fields must be entered correctly.";
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="w-full max-w-2xl space-y-8">
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="First Name" 
                        {...field} 
                        className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.firstName && "border-destructive focus-visible:border-destructive animate-shake")} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="Last Name" 
                        {...field} 
                        className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.lastName && "border-destructive focus-visible:border-destructive animate-shake")} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="Valid Phone Number" 
                        {...field} 
                        onChange={(e) => handlePhoneChange(e, field)} 
                        className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.phone && "border-destructive focus-visible:border-destructive animate-shake")} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="Email" 
                        type="email" 
                        {...field} 
                        className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.email && "border-destructive focus-visible:border-destructive animate-shake")} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="Date of Birth" 
                        {...field} 
                        onChange={(e) => handleDateChange(e, field)} 
                        className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.dob && "border-destructive focus-visible:border-destructive animate-shake")} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ssn"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="Social Security Number" 
                        {...field} 
                        onChange={(e) => handleSSNChange(e, field)} 
                        className={cn(
                          "h-auto py-4 bg-card shadow-xl focus-visible:ring-0 focus-visible:ring-offset-0",
                          errors.ssn
                              ? "border-destructive focus-visible:border-destructive animate-shake"
                              : "focus-visible:border-primary",
                          ssnValidationState === 'valid' && "border-primary focus-visible:border-primary"
                      )}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
        </div>
        <FormNavigation actionLabel="NEXT">
          {getErrorMessage() && (
            <p className={cn("text-[10px] font-medium leading-tight", (errors.dob || errors.ssn) ? "text-destructive" : "text-foreground")}>
              {getErrorMessage()}
            </p>
          )}
        </FormNavigation>
      </form>
    </Form>
  );
}
