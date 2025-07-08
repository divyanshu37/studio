
'use client';

import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { differenceInYears, parse, isValid } from 'date-fns';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn, formatPhoneNumber, formatSsn } from '@/lib/utils';

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

export default function InsuranceForm() {
  const { control, formState: { errors } } = useFormContext<InsuranceFormValues>();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    field.onChange(formatPhoneNumber(e.target.value));
  };

  const handleSSNChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    field.onChange(formatSsn(e.target.value));
  };

  return (
    <div className="w-full max-w-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
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
            control={control}
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
            control={control}
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
            control={control}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <FormField
            control={control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    type="date"
                    {...field}
                    className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.dob && "border-destructive focus-visible:border-destructive animate-shake")} 
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={cn("h-auto py-4 bg-card shadow-xl text-base focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.gender && "border-destructive focus-visible:border-destructive animate-shake")}>
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="not-specified">Not specified</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={control}
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
                        : "focus-visible:border-primary"
                )}
                />
              </FormControl>
            </FormItem>
          )}
        />
    </div>
  );
}
