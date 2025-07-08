'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const formSchema = z.object({
  differentOwner: z.string().min(1, { message: "Please select an option." }),
  gender: z.string().min(1, { message: "Please select your gender." }),
  healthQuestion1: z.string().min(1, { message: "This question is required." }),
  healthQuestion2: z.string().min(1, { message: "This question is required." }),
  healthQuestion3: z.string().min(1, { message: "This question is required." }),
});

export type AdditionalQuestionsFormValues = z.infer<typeof formSchema>;

interface AdditionalQuestionsFormProps {
  onBack: () => void;
  onNext: (data: AdditionalQuestionsFormValues) => void;
}

export default function AdditionalQuestionsForm({ onBack, onNext }: AdditionalQuestionsFormProps) {
  const form = useForm<AdditionalQuestionsFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      differentOwner: 'no',
    },
  });

  const { formState: { errors } } = form;

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="w-full max-w-2xl space-y-8">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="differentOwner"
            render={({ field }) => (
              <FormItem className="space-y-3 p-6 bg-card/50 rounded-lg shadow-lg text-left">
                <FormLabel className="text-base font-semibold text-foreground">Is the policy owner different than the insured?</FormLabel>
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
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3 p-6 bg-card/50 rounded-lg shadow-lg text-left">
                <FormLabel className="text-base font-semibold text-foreground">Your gender?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="male" />
                      </FormControl>
                      <FormLabel className="font-normal">Male</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="female" />
                      </FormControl>
                      <FormLabel className="font-normal">Female</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="not-specified" />
                      </FormControl>
                      <FormLabel className="font-normal">Not specified</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="healthQuestion1"
            render={({ field }) => (
              <FormItem className="space-y-3 p-6 bg-card/50 rounded-lg shadow-lg text-left">
                <FormLabel className="text-base font-semibold text-foreground">Have you ever been diagnosed, treated, tested positive for, or been given any medical advice by a member of the medical profession for AIDS or HIV, Bipolar Disorder, Schizophrenia, Alzheimer's, Dementia, or other progressive neurological disorder? *</FormLabel>
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
            name="healthQuestion2"
            render={({ field }) => (
              <FormItem className="space-y-3 p-6 bg-card/50 rounded-lg shadow-lg text-left">
                <FormLabel className="text-base font-semibold text-foreground">Have you ever been diagnosed, treated, tested positive for, or been given any medical advice by a member of the medical profession for any condition that requires the use of oxygen or dialysis? *</FormLabel>
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
            name="healthQuestion3"
            render={({ field }) => (
              <FormItem className="space-y-3 p-6 bg-card/50 rounded-lg shadow-lg text-left">
                <FormLabel className="text-base font-semibold text-foreground">Within the last 5 years, have you been diagnosed with, hospitalized, treated by a licensed member of the medical profession for Cancer (except basal/squamous cell of the skin), Stroke, Heart Attack, Diabetes requiring insulin, Chronic Obstructive Pulmonary Disease (COPD), Chronic Hepatitis, Cirrhosis of the Liver, Alcohol or Drug Abuse, Pulmonary Arterial Hypertension or Hereditary Angioedema except those related to the Human Immunodeficiency Virus (HIV) or have you had any diagnostic testing that has not been completed for any of the conditions listed above? *</FormLabel>
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
                <span>NEXT</span>
                <ArrowRight className="h-5 w-5" />
            </Button>
        </div>
      </form>
    </Form>
  );
}
