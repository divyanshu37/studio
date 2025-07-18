
'use client';

import { useState } from 'react';
import type { PaymentFormValues } from '@/lib/schema';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn, formatLastFour } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CreditCard, Landmark } from 'lucide-react';
import CardPaymentForm from './card-payment-form';

const ApplePayLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="20" viewBox="0 0 50 20">
    <path d="M42.32,10.38a3,3,0,0,0-2.32,1.23,2.5,2.5,0,0,1-2.15.9,2.68,2.68,0,0,1-2.29-1,4.42,4.42,0,0,0-3.48-1.85,4.3,4.3,0,0,0-3.79,2.1,4.25,4.25,0,0,0-1.68,3.75,5.77,5.77,0,0,0,1,3.48,4.72,4.72,0,0,0,3.31,1.59,4,4,0,0,0,3.29-1.54,2.5,2.5,0,0,1,2.3-.92,2.37,2.37,0,0,1,2.15.92,4.33,4.33,0,0,0,3.58,1.59,4.48,4.48,0,0,0,4-2.42A4.2,4.2,0,0,0,42.32,10.38ZM39,4.73a4.23,4.23,0,0,0-2.87,1.2,4.06,4.06,0,0,0-1.4,3.08,3.24,3.24,0,0,0,.15.89,4.38,4.38,0,0,1,2.79-1,4.14,4.14,0,0,1,1.51.27A4.29,4.29,0,0,0,39,4.73Z"/>
    <path d="M9.36,10.22a5.41,5.41,0,0,0-4.63,2.64,5.2,5.2,0,0,0-1.63,4A5.36,5.36,0,0,0,8,19.64a5.21,5.21,0,0,0,4.32-2.3,1.3,1.3,0,0,1,1.13-.58,1.26,1.26,0,0,1,1.1.58,5.17,5.17,0,0,0,4.28,2.3,5.39,5.39,0,0,0,4.87-2.82,5.43,5.43,0,0,0,.2-2.3,5.32,5.32,0,0,0-4.6-2.64,5.15,5.15,0,0,0-4.22,2.32h-.1a5.13,5.13,0,0,0-4.25-2.32Zm1.43,7.62a3.67,3.67,0,0,1-3.13-1.64A3.83,3.83,0,0,1,7.2,13a3.53,3.53,0,0,1,3-1.84,3.62,3.62,0,0,1,3.1,1.8h.07a3.58,3.58,0,0,1,3.06-1.8,3.58,3.58,0,0,1,3.42,2.06,3.6,3.6,0,0,1-2.93,5.1,3.5,3.5,0,0,1-3.6-2.12H13a3.52,3.52,0,0,1-2.22,2.12Z"/>
    <path d="M12.83,6.49a1.25,1.25,0,0,1,1.11.58,5.18,5.18,0,0,0,4.29,2.3,5.39,5.39,0,0,0,4.86-2.82,5.43,5.43,0,0,0,.2-2.3A5.32,5.32,0,0,0,18.7,1.61,5.15,5.15,0,0,0,14.48,4h-.1A5.13,5.13,0,0,0,10.13,1.61,5.41,5.41,0,0,0,5.5,4.25a5.2,5.2,0,0,0-1.63,4A5.36,5.36,0,0,0,8.74,11a5.21,5.21,0,0,0,4.32-2.3A1.3,1.3,0,0,1,14.2,8.09,1.26,1.26,0,0,1,12.83,6.49Zm-2,1.8a3.67,3.67,0,0,1-3.13-1.64A3.83,3.83,0,0,1,7.2,3.39a3.53,3.53,0,0,1,3-1.84,3.62,3.62,0,0,1,3.1,1.8h.07a3.58,3.58,0,0,1,3.06-1.8,3.58,3.58,0,0,1,3.42,2.06,3.6,3.6,0,0,1-2.93,5.1,3.5,3.5,0,0,1-3.6-2.12H13a3.52,3.52,0,0,1-2.22,2.12Z"/>
  </svg>
);


export default function PaymentForm() {
  const { control, formState: { errors }, setValue } = useFormContext<PaymentFormValues>();
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'card'>('bank');

  const handleSsnChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    field.onChange(formatLastFour(e.target.value));
  };

  const selectPaymentMethod = (method: 'bank' | 'card') => {
    setPaymentMethod(method);
    setValue('paymentMethod', method);
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="space-y-4 text-left">
        <h3 className="text-base font-semibold text-foreground">How would you like to pay?</h3>
        <div className="flex flex-col sm:flex-row gap-2">
            <Button type="button" variant={paymentMethod === 'bank' ? 'default' : 'outline'} className="w-full justify-start h-14 text-base" onClick={() => selectPaymentMethod('bank')}>
                <Landmark className="mr-3" />
                Bank Account
            </Button>
            <Button type="button" variant={paymentMethod === 'card' ? 'default' : 'outline'} className="w-full justify-start h-14 text-base" onClick={() => selectPaymentMethod('card')}>
                <CreditCard className="mr-3" />
                Credit/Debit Card
            </Button>
        </div>
        <div className="relative my-4">
            <hr className="border-border" />
            <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-background px-2 text-sm text-muted-foreground">or</span>
        </div>
        <Button type="button" variant="black" className="w-full h-14">
            <ApplePayLogo />
        </Button>
      </div>
      
      <div className="mt-8 space-y-4 text-left">
        {paymentMethod === 'bank' && (
             <div className="space-y-4 animate-fade-in-up">
                <h3 className="text-base font-semibold text-foreground">Bank Account Details</h3>
                <FormField
                control={control}
                name="paymentAccountHolderName"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Input placeholder="Account Holder Name" autoComplete="name" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.paymentAccountHolderName && "border-destructive focus-visible:border-destructive animate-shake")} />
                    </FormControl>
                    </FormItem>
                )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={control}
                    name="paymentAccountNumber"
                    render={({ field }) => (
                    <FormItem>
                        <FormControl>
                        <Input placeholder="Account Number" autoComplete="off" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.paymentAccountNumber && "border-destructive focus-visible:border-destructive animate-shake")} />
                        </FormControl>
                    </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="paymentRoutingNumber"
                    render={({ field }) => (
                    <FormItem>
                        <FormControl>
                        <Input placeholder="Routing Number" autoComplete="off" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.paymentRoutingNumber && "border-destructive focus-visible:border-destructive animate-shake")} />
                        </FormControl>
                    </FormItem>
                    )}
                />
                </div>
            </div>
        )}

        {paymentMethod === 'card' && (
            <div className="animate-fade-in-up">
                 <h3 className="text-base font-semibold text-foreground">Card Details</h3>
                 <CardPaymentForm />
            </div>
        )}

        <div className="pt-4">
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
    </div>
  );
}
