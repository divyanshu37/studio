'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormNavigation from '@/components/form-navigation';
import { cn } from '@/lib/utils';

const coverageOptions = [
  "$10,000", "$12,000", "$14,000", "$16,000", "$18,000", "$20,000", "$25,000"
];

const formSchema = z.object({
  coverage: z.string().min(1, { message: "Coverage amount is required." }),
  accountHolderName: z.string().min(1, { message: "Account holder name is required." }),
  accountNumber: z.string().min(1, { message: "Account number is required." }),
  routingNumber: z.string().min(9, { message: "A valid 9-digit routing number is required." }).max(9, { message: "A valid 9-digit routing number is required." }),
});

export type PaymentFormValues = z.infer<typeof formSchema>;

interface PaymentFormProps {
  onBack: () => void;
  onSubmit: (data: PaymentFormValues) => void;
}

export default function PaymentForm({ onBack, onSubmit }: PaymentFormProps) {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      coverage: "",
      accountHolderName: "",
      accountNumber: "",
      routingNumber: "",
    }
  });

  const { formState: { errors } } = form;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl space-y-8">
        <div className="space-y-6">
          <div className="space-y-3 p-6 bg-card/50 rounded-lg shadow-lg text-left">
            <h3 className="text-base font-semibold text-foreground mb-4">Coverage and Premium</h3>
            <FormField
              control={form.control}
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
          </div>

          <div className="space-y-4 p-6 bg-card/50 rounded-lg shadow-lg text-left">
            <h3 className="text-base font-semibold text-foreground mb-4">Payment Details</h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="accountHolderName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Account Holder Name" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.accountHolderName && "border-destructive focus-visible:border-destructive animate-shake")} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Account Number" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.accountNumber && "border-destructive focus-visible:border-destructive animate-shake")} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="routingNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Routing Number" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.routingNumber && "border-destructive focus-visible:border-destructive animate-shake")} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <FormNavigation onBack={onBack} actionLabel="SUBMIT" backButton={true}>
          {hasErrors && (
            <p className="text-[10px] font-medium text-destructive leading-tight">
              All questions must be answered correctly.
            </p>
          )}
        </FormNavigation>
      </form>
    </Form>
  );
}
