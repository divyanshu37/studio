'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const formSchema = z.object({
  tobacco: z.string().min(1, { message: "Please select an option." }),
  health: z.string().min(1, { message: "Please select an option." }),
});

export type AdditionalQuestionsFormValues = z.infer<typeof formSchema>;

interface AdditionalQuestionsFormProps {
  onBack: () => void;
  onSubmit: (data: AdditionalQuestionsFormValues) => void;
}

export default function AdditionalQuestionsForm({ onBack, onSubmit }: AdditionalQuestionsFormProps) {
  const form = useForm<AdditionalQuestionsFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
  });

  const { formState: { errors } } = form;

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl space-y-8">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="tobacco"
            render={({ field }) => (
              <FormItem className="space-y-3 p-6 bg-card/50 rounded-lg shadow-lg">
                <FormLabel className="text-base font-semibold text-foreground">Do you smoke or use tobacco products?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="no" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="health"
            render={({ field }) => (
              <FormItem className="space-y-3 p-6 bg-card/50 rounded-lg shadow-lg">
                <FormLabel className="text-base font-semibold text-foreground">Do you have any major health issues such as cancer, heart disease, or diabetes?</FormLabel>
                 <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="no" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="relative flex justify-between items-center">
            <Button type="button" onClick={onBack} variant="outline" className="h-auto justify-between w-48 px-5 py-4 text-base font-body border-2 border-foreground/80 shadow-xl tracking-widest bg-black text-white hover:bg-black/90">
                <ArrowLeft className="h-5 w-5" />
                <span>BACK</span>
            </Button>
            <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
                <div className="w-full max-w-[20vw]">
                    <div className="min-h-[1.25rem]">
                        {hasErrors && (
                             <p className="text-xs font-medium text-destructive text-center">
                                All questions must be answered.
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <Button type="submit" className="h-auto justify-between w-48 px-5 py-4 text-base font-body border-2 border-white shadow-xl tracking-widest">
                <span>SUBMIT</span>
                <ArrowRight className="h-5 w-5" />
            </Button>
        </div>
      </form>
    </Form>
  );
}
