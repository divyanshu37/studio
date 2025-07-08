'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ArrowRight } from 'lucide-react';

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  phone: z.string().min(14, { message: "Please enter a complete phone number." }),
  email: z.string().min(1, { message: "Email is required." }).email({ message: "Invalid email address." }),
  dob: z.string().min(10, { message: "Please enter a complete date of birth." }),
  ssn: z.string().min(11, { message: "Please enter a complete social security number." }),
});

type InsuranceFormValues = z.infer<typeof formSchema>;

export default function InsuranceForm() {
  const form = useForm<InsuranceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      dob: '',
      ssn: '',
    },
  });

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
                      <Input placeholder="First Name" {...field} className="h-auto py-4 bg-card" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} className="h-auto py-4 bg-card" />
                    </FormControl>
                    <FormMessage />
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
                      <Input placeholder="Valid Phone Number" {...field} onChange={(e) => handlePhoneChange(e, field)} className="h-auto py-4 bg-card" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Email" type="email" {...field} className="h-auto py-4 bg-card" />
                    </FormControl>
                    <FormMessage />
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
                      <Input placeholder="Date of Birth" {...field} onChange={(e) => handleDateChange(e, field)} className="h-auto py-4 bg-card" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ssn"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Social Security Number" {...field} onChange={(e) => handleSSNChange(e, field)} className="h-auto py-4 bg-card" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
        </div>
        <div className="flex justify-end">
            <Button type="submit" size="lg" className="px-8 py-6 text-base">
                NEXT
                <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
        </div>
      </form>
    </Form>
  );
}
