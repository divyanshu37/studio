
'use client';

import type { AdditionalQuestionsFormValues } from '@/lib/schema';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AdditionalQuestionsForm() {
  const { control, formState: { errors } } = useFormContext<AdditionalQuestionsFormValues>();

  const questions = [
    { name: 'differentOwner', label: 'Is the policy owner different than the insured?' },
    { name: 'healthQuestion1', label: 'Have you ever been diagnosed or treated for HIV, AIDS, bipolar, schizophrenia, dementia, or any progressive neurological disorder?' },
    { name: 'healthQuestion2', label: 'Have you ever used oxygen or dialysis for any condition?' },
    { name: 'healthQuestion3', label: 'In the last 5 years, have you had cancer (non-skin), stroke, heart attack, insulin-treated diabetes, COPD, hepatitis, cirrhosis, drug/alcohol abuse, PAH, hereditary angioedema, or pending tests for any of these?' },
    { name: 'tobaccoUse', label: 'Have you used any nicotine products in the past 12 months?' },
    { name: 'existingPolicies', label: 'Do you have any existing life or annuity policies with this or another company?' },
  ] as const;

  return (
    <div className="w-full max-w-2xl space-y-6">
      {questions.map((q) => (
        <FormField
          key={q.name}
          control={control}
          name={q.name}
          render={({ field }) => (
            <FormItem className={cn("space-y-4 p-6 bg-card/50 rounded-lg shadow-lg text-left border-2 border-transparent", errors[q.name] && "border-destructive animate-shake")}>
              <FormLabel className="text-base font-semibold text-foreground text-center block">{q.label}</FormLabel>
              <FormControl>
                <div className="flex justify-center items-center gap-4">
                  <Button
                    type="button"
                    variant={field.value === 'yes' ? 'default' : 'outline'}
                    className="w-32"
                    onClick={() => field.onChange('yes')}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant={field.value === 'no' ? 'default' : 'outline'}
                    className="w-32"
                    onClick={() => field.onChange('no')}
                  >
                    No
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}
