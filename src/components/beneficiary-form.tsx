'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import FormNavigation from '@/components/form-navigation';
import { cn, formatDateInput } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

const formSchema = z.object({
  tobaccoUse: z.string().min(1, { message: 'This question is required.' }),
  existingPolicies: z.string().min(1, { message: 'This question is required.' }),
  effectiveDate: z.date({
    required_error: 'An effective date is required.',
  }),
  beneficiaryCount: z.coerce.number().min(1, { message: 'Please enter a number.' }).int(),
  beneficiary1FirstName: z.string().min(1, { message: "First name is required." }),
  beneficiary1LastName: z.string().min(1, { message: "Last name is required." }),
  beneficiary1Dob: z.string().min(10, { message: "Please enter a complete date of birth." }),
});

export type BeneficiaryFormValues = z.infer<typeof formSchema>;

interface BeneficiaryFormProps {
  onBack: () => void;
  onSubmit: (data: BeneficiaryFormValues) => void;
}

export default function BeneficiaryForm({ onBack, onSubmit }: BeneficiaryFormProps) {
  const form = useForm<BeneficiaryFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      tobaccoUse: "",
      existingPolicies: "",
      effectiveDate: new Date(),
      beneficiaryCount: NaN,
      beneficiary1FirstName: "",
      beneficiary1LastName: "",
      beneficiary1Dob: "",
    }
  });

  const { formState: { errors } } = form;
  const hasErrors = Object.keys(errors).length > 0;

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    field.onChange(formatDateInput(e.target.value));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl space-y-8">
        <div className="space-y-6">
          <FormField
            control={form.control}
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
            control={form.control}
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
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <FormField
                control={form.control}
                name="effectiveDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-2">
                    <FormLabel className="text-left text-base font-semibold text-foreground">Desired effective date of this policy</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full h-auto py-4 pl-3 text-left font-normal bg-card shadow-xl text-base",
                              !field.value && "text-muted-foreground",
                              errors.effectiveDate && "border-destructive animate-shake"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span className="text-neutral-400">Select the desired effective date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setDate(new Date().getDate() - 1))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="beneficiaryCount"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || '')} value={isNaN(field.value) ? '' : field.value} placeholder="How many primary beneficiaries?" className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiaryCount && "border-destructive focus-visible:border-destructive animate-shake")} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          
            <h3 className="text-base font-semibold text-foreground text-left pt-4">Primary Beneficiary 1</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="beneficiary1FirstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Beneficiary First Name" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1FirstName && "border-destructive focus-visible:border-destructive animate-shake")} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="beneficiary1LastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Beneficiary Last Name" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1LastName && "border-destructive focus-visible:border-destructive animate-shake")} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="beneficiary1Dob"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Date of Birth (MM/DD/YYYY)" {...field} onChange={(e) => handleDateInputChange(e, field)} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1Dob && "border-destructive focus-visible:border-destructive animate-shake")} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormNavigation onBack={onBack} actionLabel="SUBMIT" backButton={true}>
          {hasErrors && (
            <p className="text-[10px] font-medium text-destructive leading-tight">
              All questions must be answered.
            </p>
          )}
        </FormNavigation>
      </form>
    </Form>
  );
}
