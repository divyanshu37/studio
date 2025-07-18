
'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { PaymentFormValues } from '@/lib/schema';

export default function CardPaymentForm() {
    const { control, formState: { errors } } = useFormContext<PaymentFormValues>();

    const formatCardNumber = (value: string) => {
        return value.replace(/[^\d]/g, "").substring(0, 16);
    };

    const formatExpiry = (value: string) => {
        const rawValue = value.replace(/\D/g, '').slice(0, 4);
        const month = rawValue.slice(0, 2);
        const year = rawValue.slice(2, 4);
      
        if (rawValue.length > 2) {
          return `${month}/${year}`;
        }
        return month;
    };

    const formatCvc = (value: string) => {
        return value.replace(/[^\d]/g, "").substring(0, 4);
    };

    const formatZip = (value: string) => {
        return value.replace(/[^\d]/g, "").substring(0, 5);
    };


    return (
        <div className="space-y-4">
            <FormField
            control={control}
            name="cardholderName"
            render={({ field }) => (
                <FormItem>
                <FormControl>
                    <Input placeholder="Cardholder Name" autoComplete="cc-name" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.cardholderName && "border-destructive focus-visible:border-destructive animate-shake")} />
                </FormControl>
                </FormItem>
            )}
            />
            <FormField
                control={control}
                name="cardNumber"
                render={({ field }) => (
                <FormItem>
                    <FormControl>
                    <Input 
                        placeholder="Card Number" 
                        autoComplete="cc-number" 
                        {...field}
                        onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
                        className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.cardNumber && "border-destructive focus-visible:border-destructive animate-shake")} />
                    </FormControl>
                </FormItem>
                )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                    control={control}
                    name="cardExpiry"
                    render={({ field }) => (
                    <FormItem>
                        <FormControl>
                        <Input 
                            placeholder="MM/YY" 
                            autoComplete="cc-exp" 
                            {...field}
                            onChange={(e) => field.onChange(formatExpiry(e.target.value))}
                            className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.cardExpiry && "border-destructive focus-visible:border-destructive animate-shake")} />
                        </FormControl>
                    </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="cardCvc"
                    render={({ field }) => (
                    <FormItem>
                        <FormControl>
                        <Input 
                            placeholder="CVC" 
                            autoComplete="cc-csc" 
                            {...field} 
                            onChange={(e) => field.onChange(formatCvc(e.target.value))}
                            className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.cardCvc && "border-destructive focus-visible:border-destructive animate-shake")} />
                        </FormControl>
                    </FormItem>
                    )}
                />
                 <FormField
                    control={control}
                    name="billingZip"
                    render={({ field }) => (
                    <FormItem>
                        <FormControl>
                        <Input 
                            placeholder="Billing ZIP" 
                            autoComplete="postal-code" 
                            {...field} 
                            onChange={(e) => field.onChange(formatZip(e.target.value))}
                            className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.billingZip && "border-destructive focus-visible:border-destructive animate-shake")} />
                        </FormControl>
                    </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
