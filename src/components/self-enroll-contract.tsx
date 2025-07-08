'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  pin: z.string().length(4, { message: "PIN must be 4 digits." }),
});

type VerificationFormValues = z.infer<typeof formSchema>;

interface SelfEnrollContractProps {
  onNext: () => void;
  phoneNumber?: string;
}

export default function SelfEnrollContract({ onNext, phoneNumber }: SelfEnrollContractProps) {
  const [generatedPin, setGeneratedPin] = useState('');
  const { toast } = useToast();

  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      pin: "",
    }
  });

  useEffect(() => {
    // Generate a random 4-digit PIN on the client to avoid hydration mismatch
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedPin(newPin);
  }, []);

  const onSubmit = (data: VerificationFormValues) => {
    if (data.pin === generatedPin) {
      onNext();
    } else {
      form.setError("pin", {
        type: "manual",
        message: "The entered PIN is incorrect.",
      });
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: "The PIN you entered is incorrect. Please try again.",
      });
    }
  };

  const last4Digits = phoneNumber ? phoneNumber.replace(/[^\d]/g, '').slice(-4) : '2523';
  const maskedPhoneNumber = `***-***-${last4Digits}`;
  const { formState: { errors } } = form;

  return (
    <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Phone Verification</h2>
      <p className="text-base text-foreground/80 max-w-xs">
        Please enter the PIN from your text message to sign the agreement.
      </p>

      <div className="w-full space-y-3 text-left">
        <div className="bg-card rounded-lg p-4 border shadow-sm">
          <p className="text-sm text-muted-foreground">Verification code sent to phone ending in:</p>
          <p className="text-xl font-semibold tracking-wider text-foreground mt-1">{maskedPhoneNumber}</p>
        </div>
        
        <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
          <p className="text-sm text-primary">Access PIN:</p>
          <p className="text-4xl font-bold tracking-widest text-primary mt-1">{generatedPin || '----'}</p>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4 pt-4">
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Enter PIN</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="----" 
                    {...field}
                    maxLength={4}
                    className={cn(
                        "h-auto text-center text-2xl tracking-[1rem] py-3 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", 
                        errors.pin && "border-destructive focus-visible:border-destructive animate-shake"
                    )}
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Verify & Continue
          </Button>
        </form>
      </Form>
    </div>
  );
}
