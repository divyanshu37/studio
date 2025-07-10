
'use client';

import type { PaymentFormValues } from '@/lib/schema';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn, formatLastFour } from '@/lib/utils';

export default function PaymentForm() {
  const { control, formState: { errors } } = useFormContext<PaymentFormValues>();

  const handleSsnChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    field.onChange(formatLastFour(e.target.value));
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-foreground text-left">Payment Details</h3>
        <FormField
          control={control}
          name="accountHolderName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Account Holder Name" autoComplete="name" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.accountHolderName && "border-destructive focus-visible:border-destructive animate-shake")} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Account Number" autoComplete="off" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.accountNumber && "border-destructive focus-visible:border-destructive animate-shake")} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="routingNumber"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Routing Number" autoComplete="off" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.routingNumber && "border-destructive focus-visible:border-destructive animate-shake")} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={control}
          name="lastFour"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  placeholder="Last 4 Digits of SSN" 
                  autoComplete="off"
                  {...field} 
                  onChange={(e) => handleSsnChange(e, field)}
                  className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.lastFour && "border-destructive focus-visible:border-destructive animate-shake")} 
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
