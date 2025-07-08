'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ArrowRight } from 'lucide-react';

const formSchema = z.object({
  users: z.array(z.object({
    firstName: z.string().min(1, { message: "First name is required." }),
    lastName: z.string().min(1, { message: "Last name is required." }),
  })).min(3),
});

type InsuranceFormValues = z.infer<typeof formSchema>;

export default function InsuranceForm() {
  const form = useForm<InsuranceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      users: [{ firstName: '', lastName: '' }, { firstName: '', lastName: '' }, { firstName: '', lastName: '' }],
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "users",
  });

  function onSubmit(data: InsuranceFormValues) {
    console.log(data);
    // Handle form submission, e.g. navigate to the next step
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl space-y-8">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`users.${index}.firstName`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="First Name" {...field} className="py-6 bg-card border-gray-300" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`users.${index}.lastName`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} className="py-6 bg-card border-gray-300" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
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
