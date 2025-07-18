
'use client';

import { useState } from 'react';
import type { PaymentFormValues } from '@/lib/schema';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn, formatLastFour } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CreditCard, Landmark, ArrowLeft } from 'lucide-react';
import CardPaymentForm from './card-payment-form';
import { ApplePayLogo } from './apple-pay-logo';
import { Separator } from './ui/separator';


export default function PaymentForm() {
  const { control, formState: { errors }, setValue, trigger } = useFormContext<PaymentFormValues>();
  const [paymentChoice, setPaymentChoice] = useState<'choice' | 'bank' | 'card'>('choice');

  const handleSsnChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    field.onChange(formatLastFour(e.target.value));
  };

  const selectPaymentMethod = (method: 'bank' | 'card') => {
    setValue('paymentMethod', method, { shouldValidate: true });
    setPaymentChoice(method);
    // Clear fields from the other method to prevent validation errors on invisible fields
    if (method === 'bank') {
        setValue('cardholderName', '');
        setValue('cardNumber', '');
        setValue('cardExpiry', '');
        setValue('cardCvc', '');
        setValue('billingZip', '');
    } else {
        setValue('paymentAccountHolderName', '');
        setValue('paymentAccountNumber', '');
        setValue('paymentRoutingNumber', '');
    }
    trigger(); // Re-run validation
  }

  if (paymentChoice === 'choice') {
    return (
        <div className="w-full max-w-4xl flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-8">How would you like to pay?</h2>
            <div className="w-full flex flex-col md:flex-row justify-center items-stretch gap-8">
                {/* Bank Account Card */}
                <div 
                    onClick={() => selectPaymentMethod('bank')}
                    className="w-full md:w-1/2 p-8 bg-card text-card-foreground border-2 border-primary rounded-lg shadow-xl flex flex-col items-center justify-center transition-transform duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 cursor-pointer"
                >
                    <Landmark className="w-12 h-12 mb-4 text-primary" />
                    <h3 className="font-headline text-2xl font-bold tracking-tight">Bank Account</h3>
                </div>

                {/* Credit/Debit Card */}
                <div 
                    onClick={() => selectPaymentMethod('card')}
                    className="w-full md:w-1/2 p-8 bg-card text-card-foreground border-2 border-primary rounded-lg shadow-xl flex flex-col items-center justify-center transition-transform duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 cursor-pointer"
                >
                    <CreditCard className="w-12 h-12 mb-4 text-primary" />
                    <h3 className="font-headline text-2xl font-bold tracking-tight">Credit/Debit Card</h3>
                </div>
            </div>
             <div className="relative my-8 w-full max-w-sm">
                <hr className="border-border" />
                <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-background px-2 text-sm text-muted-foreground">or</span>
            </div>
             <div className="w-full max-w-sm">
                <Button type="button" variant="black" className="w-full h-14" disabled>
                    <ApplePayLogo />
                </Button>
            </div>
        </div>
    )
  }

  return (
    <div className="w-full max-w-2xl text-left">
        <Button variant="ghost" onClick={() => setPaymentChoice('choice')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Payment Options
        </Button>

        {paymentChoice === 'bank' && (
             <div className="space-y-4 animate-fade-in-up">
                <h3 className="text-xl font-semibold text-foreground mb-4">Bank Account Details</h3>
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

        {paymentChoice === 'card' && (
            <div className="animate-fade-in-up">
                 <h3 className="text-xl font-semibold text-foreground mb-4">Card Details</h3>
                 <CardPaymentForm />
            </div>
        )}

        <div className="pt-8">
             <h3 className="text-xl font-semibold text-foreground mb-4">Final Verification</h3>
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
