'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormNavigation from '@/components/form-navigation';
import { cn, formatPhoneNumber } from '@/lib/utils';

const relationshipOptions = [
  "Aunt", "Brother", "Child", "Civil Union/Partner", "Cousin", "Dependent", 
  "Father", "Friend", "Grandfather", "Grandmother", "Guardian", "Mother", 
  "Parent", "Self", "Sister", "Spouse", "Stepbrother", "Stepfather", 
  "Stepmother", "Stepsister", "Uncle"
];

const formSchema = z.object({
  beneficiary1Address: z.string().min(1, { message: "Address is required." }),
  beneficiary1Apt: z.string().optional(),
  beneficiary1City: z.string().min(1, { message: "City is required." }),
  beneficiary1State: z.string().min(1, { message: "State is required." }),
  beneficiary1Zip: z.string().min(5, { message: "A valid zip code is required." }),
  beneficiary1Relationship: z.string().min(1, { message: "Relationship is required." }),
  beneficiary1Phone: z.string().min(14, { message: "Please enter a complete phone number." }),
  contingentBeneficiaryCount: z.coerce.number().min(0, { message: "Please enter a number." }).int(),
});

export type BeneficiaryAddressFormValues = z.infer<typeof formSchema>;

interface BeneficiaryAddressFormProps {
  onBack: () => void;
  onSubmit: (data: BeneficiaryAddressFormValues) => void;
}

export default function BeneficiaryAddressForm({ onBack, onSubmit }: BeneficiaryAddressFormProps) {
  const form = useForm<BeneficiaryAddressFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      beneficiary1Address: "",
      beneficiary1Apt: "",
      beneficiary1City: "",
      beneficiary1State: "",
      beneficiary1Zip: "",
      beneficiary1Relationship: "",
      beneficiary1Phone: "",
      contingentBeneficiaryCount: NaN,
    }
  });

  const { formState: { errors } } = form;
  const hasErrors = Object.keys(errors).length > 0;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    field.onChange(formatPhoneNumber(e.target.value));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl space-y-8">
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-foreground text-left">Primary Beneficiary 1 Address</h3>
          <FormField
            control={form.control}
            name="beneficiary1Address"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Street Address" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1Address && "border-destructive focus-visible:border-destructive animate-shake")} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="beneficiary1Apt"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Apt, suite, etc. (optional)" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1Apt && "border-destructive focus-visible:border-destructive animate-shake")} />
                    </FormControl>
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="beneficiary1City"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="City" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1City && "border-destructive focus-visible:border-destructive animate-shake")} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="beneficiary1State"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="State" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1State && "border-destructive focus-visible:border-destructive animate-shake")} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="beneficiary1Zip"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Zip Code" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1Zip && "border-destructive focus-visible:border-destructive animate-shake")} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <h3 className="text-base font-semibold text-foreground text-left pt-4">Primary Beneficiary 1 Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="beneficiary1Relationship"
              render={({ field }) => (
                <FormItem>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className={cn("h-auto py-4 bg-card shadow-xl text-base focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1Relationship && "border-destructive focus-visible:border-destructive animate-shake")}>
                        <SelectValue placeholder="Relationship to Insured" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {relationshipOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="beneficiary1Phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Mobile Number" {...field} onChange={(e) => handlePhoneChange(e, field)} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1Phone && "border-destructive focus-visible:border-destructive animate-shake")} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="contingentBeneficiaryCount"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || '')} value={isNaN(field.value) ? '' : field.value} placeholder="How many contingent beneficiaries?" className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.contingentBeneficiaryCount && "border-destructive focus-visible:border-destructive animate-shake")} />
                </FormControl>
              </FormItem>
            )}
          />
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
