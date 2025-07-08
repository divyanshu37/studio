
'use client';

import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

export const additionalQuestionsFormSchema = z.object({
  differentOwner: z.string().min(1, { message: "Please select an option." }),
  healthQuestion1: z.string().min(1, { message: "This question is required." }),
  healthQuestion2: z.string().min(1, { message: "This question is required." }),
  healthQuestion3: z.string().min(1, { message: "This question is required." }),
  tobaccoUse: z.string().min(1, { message: 'This question is required.' }),
  existingPolicies: z.string().min(1, { message: 'This question is required.' }),
});

export type AdditionalQuestionsFormValues = z.infer<typeof additionalQuestionsFormSchema>;

export default function AdditionalQuestionsForm() {
  const { control, formState: { errors } } = useFormContext<AdditionalQuestionsFormValues>();

  return (
    <div className="w-full max-w-2xl space-y-6">
      <FormField
        control={control}
        name="differentOwner"
        render={({ field }) => (
          <FormItem className={cn("space-y-3 p-6 bg-card/50 rounded-lg shadow-lg text-left border-2 border-transparent", errors.differentOwner && "border-destructive animate-shake")}>
            <FormLabel className="text-base font-semibold text-foreground">Is the policy owner different than the insured?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="yes" className="border-foreground/80 border-2" />
                  </FormControl>
                  <FormLabel className="font-normal">Yes</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="no" className="border-foreground/80 border-2" />
                  </FormControl>
                  <FormLabel className="font-normal">No</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
       <FormField
        control={control}
        name="healthQuestion1"
        render={({ field }) => (
          <FormItem className={cn("space-y-3 p-6 bg-card/50 rounded-lg shadow-lg text-left border-2 border-transparent", errors.healthQuestion1 && "border-destructive animate-shake")}>
            <FormLabel className="text-base font-semibold text-foreground">Have you ever been diagnosed, treated, tested positive for, or been given any medical advice by a member of the medical profession for AIDS or HIV, Bipolar Disorder, Schizophrenia, Alzheimer's, Dementia, or other progressive neurological disorder? *</FormLabel>
             <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="yes" className="border-foreground/80 border-2" />
                  </FormControl>
                  <FormLabel className="font-normal">Yes</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="no" className="border-foreground/80 border-2" />
                  </FormControl>
                  <FormLabel className="font-normal">No</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
       <FormField
        control={control}
        name="healthQuestion2"
        render={({ field }) => (
          <FormItem className={cn("space-y-3 p-6 bg-card/50 rounded-lg shadow-lg text-left border-2 border-transparent", errors.healthQuestion2 && "border-destructive animate-shake")}>
            <FormLabel className="text-base font-semibold text-foreground">Have you ever been diagnosed, treated, tested positive for, or been given any medical advice by a member of the medical profession for any condition that requires the use of oxygen or dialysis? *</FormLabel>
             <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="yes" className="border-foreground/80 border-2" />
                  </FormControl>
                  <FormLabel className="font-normal">Yes</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="no" className="border-foreground/80 border-2" />
                  </FormControl>
                  <FormLabel className="font-normal">No</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="healthQuestion3"
        render={({ field }) => (
          <FormItem className={cn("space-y-3 p-6 bg-card/50 rounded-lg shadow-lg text-left border-2 border-transparent", errors.healthQuestion3 && "border-destructive animate-shake")}>
            <FormLabel className="text-base font-semibold text-foreground">Within the last 5 years, have you been diagnosed with, hospitalized, treated by a licensed member of the medical profession for Cancer (except basal/squamous cell of the skin), Stroke, Heart Attack, Diabetes requiring insulin, Chronic Obstructive Pulmonary Disease (COPD), Chronic Hepatitis, Cirrhosis of the Liver, Alcohol or Drug Abuse, Pulmonary Arterial Hypertension or Hereditary Angioedema except those related to the Human Immunodeficiency Virus (HIV) or have you had any diagnostic testing that has not been completed for any of the conditions listed above? *</FormLabel>
             <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="yes" className="border-foreground/80 border-2" />
                  </FormControl>
                  <FormLabel className="font-normal">Yes</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="no" className="border-foreground/80 border-2" />
                  </FormControl>
                  <FormLabel className="font-normal">No</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="tobaccoUse"
        render={({ field }) => (
          <FormItem className={cn("space-y-3 p-6 bg-card/50 rounded-lg shadow-lg text-left border-2 border-transparent", errors.tobaccoUse && "border-destructive animate-shake")}>
            <FormLabel className="text-base font-semibold text-foreground">Has the proposed applicant used tobacco or nicotine in the last 12 months including cigarettes, cigars, chewing tobacco, vape, nicotine gum, or nicotine patch? *</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl><RadioGroupItem value="yes" className="border-foreground/80 border-2" /></FormControl>
                  <FormLabel className="font-normal">Yes</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl><RadioGroupItem value="no" className="border-foreground/80 border-2" /></FormControl>
                  <FormLabel className="font-normal">No</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="existingPolicies"
        render={({ field }) => (
          <FormItem className={cn("space-y-3 p-6 bg-card/50 rounded-lg shadow-lg text-left border-2 border-transparent", errors.existingPolicies && "border-destructive animate-shake")}>
            <FormLabel className="text-base font-semibold text-foreground">Does the proposed applicant have any existing life or annuity policies with Combined Insurance or any other company? *</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl><RadioGroupItem value="yes" className="border-foreground/80 border-2" /></FormControl>
                  <FormLabel className="font-normal">Yes</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl><RadioGroupItem value="no" className="border-foreground/80 border-2" /></FormControl>
                  <FormLabel className="font-normal">No</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
