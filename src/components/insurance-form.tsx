'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { differenceInYears, parse, isValid } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    .refine((ssn) => {
        const ssnParts = ssn.replace(/-/g, '');
        if (ssnParts.length !== 9) return true; // Let min validation handle this

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
    }, {
        message: "Please enter a valid social security number."
    }),
});

type InsuranceFormValues = z.infer<typeof formSchema>;

export default function InsuranceForm() {
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    let formattedValue = '';
    if (rawValue.length > 0) {
        formattedValue = '(' + rawValue.substring(0, 3);
    }
    if (rawValue.length >= 4) {
        formattedValue += ') ' + rawValue.substring(3, 6);
    }
    if (rawValue.length >= 7) {
        formattedValue += '-' + rawValue.substring(6, 10);
    }
    field.onChange(formattedValue);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    let formattedValue = rawValue.substring(0, 2);
    if (rawValue.length > 2) {
        formattedValue += '/' + rawValue.substring(2, 4);
    }
    if (rawValue.length > 4) {
        formattedValue += '/' + rawValue.substring(4, 8);
    }
    field.onChange(formattedValue);
  };

  const handleSSNChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    let formattedValue = rawValue.substring(0, 3);
    if (rawValue.length > 3) {
        formattedValue += '-' + rawValue.substring(3, 5);
    }
    if (rawValue.length > 5) {
        formattedValue += '-' + rawValue.substring(5, 9);
    }
    field.onChange(formattedValue);
  };


  function onSubmit(data: InsuranceFormValues) {
    console.log(data);
    // Handle form submission, e.g. navigate to the next step
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl space-y-8">
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
                        className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.ssn && "border-destructive focus-visible:border-destructive animate-shake")} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
        </div>
        <div className="relative flex justify-end items-center">
            <div className="absolute left-0 right-0 text-center pointer-events-none">
                <div className="min-h-[1.25rem]">
                    {errors.dob?.message ? (
                        <p className="text-sm font-medium text-destructive">
                            {errors.dob.message}
                        </p>
                    ) : errors.ssn?.message ? (
                        <p className="text-sm font-medium text-destructive">
                            {errors.ssn.message}
                        </p>
                    ) : (Object.keys(errors).length > 0 && (
                        <p className="text-sm font-medium text-destructive">
                            Red fields must be entered correctly.
                        </p>
                    ))}
                </div>
            </div>
            <Button type="submit" size="lg" className="px-8 py-6 text-base font-body">
                NEXT
                <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
        </div>
      </form>
    </Form>
  );
}
