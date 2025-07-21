
'use client';

import type { AdditionalQuestionsFormValues } from '@/lib/schema';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import FormNavigation from './form-navigation';

interface AdditionalQuestionsFormProps {
    onNext: () => void;
    errorMessage?: string | null;
    disabled?: boolean;
}

export default function AdditionalQuestionsForm({ onNext, errorMessage, disabled }: AdditionalQuestionsFormProps) {
  const { control, watch, formState: { errors } } = useFormContext<AdditionalQuestionsFormValues>();
  const otherHealthIssuesValue = watch('otherHealthIssues');

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
                    {field.value === 'yes' && <Check />}
                  </Button>
                  <Button
                    type="button"
                    variant={field.value === 'no' ? 'default' : 'outline'}
                    className="w-32"
                    onClick={() => field.onChange('no')}
                  >
                    No
                    {field.value === 'no' && <Check />}
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      ))}

      <FormField
        control={control}
        name="otherHealthIssues"
        render={({ field }) => (
          <FormItem className={cn("space-y-4 p-6 bg-card/50 rounded-lg shadow-lg text-left border-2 border-transparent", (errors.otherHealthIssues || errors.otherHealthIssuesDetails) && "border-destructive animate-shake")}>
            <FormLabel className="text-base font-semibold text-foreground text-center block">Do you have any other health issues?</FormLabel>
            <FormControl>
              <div className="flex justify-center items-center gap-4">
                <Button
                  type="button"
                  variant={field.value === 'yes' ? 'default' : 'outline'}
                  className="w-32"
                  onClick={() => field.onChange('yes')}
                >
                  Yes
                  {field.value === 'yes' && <Check />}
                </Button>
                <Button
                  type="button"
                  variant={field.value === 'no' ? 'default' : 'outline'}
                  className="w-32"
                  onClick={() => field.onChange('no')}
                >
                  No
                  {field.value === 'no' && <Check />}
                </Button>
              </div>
            </FormControl>
            
            {otherHealthIssuesValue === 'yes' && (
              <FormField
                control={control}
                name="otherHealthIssuesDetails"
                render={({ field }) => (
                  <FormItem className="animate-fade-in-up">
                    <FormControl>
                      <Textarea
                        placeholder="Please provide details about your other health issues..."
                        {...field}
                        className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.otherHealthIssuesDetails && "border-destructive focus-visible:border-destructive animate-shake")}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </FormItem>
        )}
      />
      <FormNavigation
        onNext={onNext}
        isSubmit={false}
        actionLabel={"NEXT"}
        disabled={disabled}
        errorMessage={errorMessage}
      />
    </div>
  );
}

    