
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Logo, Icon } from '@/components/logo';
import InsuranceForm, { insuranceFormSchema } from '@/components/insurance-form';
import AdditionalQuestionsForm, { additionalQuestionsFormSchema } from '@/components/additional-questions-form';
import BeneficiaryForm, { beneficiaryFormSchema } from '@/components/beneficiary-form';
import BeneficiaryAddressForm, { beneficiaryAddressFormSchema } from '@/components/beneficiary-address-form';
import PaymentForm, { paymentFormSchema } from '@/components/payment-form';
import ThankYou from '@/components/thank-you';
import SelfEnrollLoading from '@/components/self-enroll-loading';
import SelfEnrollContract from '@/components/self-enroll-contract';
import SelfEnrollComplete from '@/components/self-enroll-complete';
import FormNavigation from '@/components/form-navigation';
import { cn } from '@/lib/utils';
import { InsuranceFormValues } from '@/components/insurance-form';
import { AdditionalQuestionsFormValues } from '@/components/additional-questions-form';
import { BeneficiaryFormValues } from '@/components/beneficiary-form';
import { BeneficiaryAddressFormValues } from '@/components/beneficiary-address-form';
import { PaymentFormValues } from '@/components/payment-form';

const fullFormSchema = insuranceFormSchema
  .merge(additionalQuestionsFormSchema)
  .merge(beneficiaryFormSchema)
  .merge(beneficiaryAddressFormSchema)
  .merge(paymentFormSchema);

export type FormValues = z.infer<typeof fullFormSchema>;

const stepFields: (keyof FormValues)[][] = [
  Object.keys(insuranceFormSchema.shape) as (keyof InsuranceFormValues)[],
  Object.keys(additionalQuestionsFormSchema.shape) as (keyof AdditionalQuestionsFormValues)[],
  Object.keys(beneficiaryFormSchema.shape) as (keyof BeneficiaryFormValues)[],
  Object.keys(beneficiaryAddressFormSchema.shape) as (keyof BeneficiaryAddressFormValues)[],
  Object.keys(paymentFormSchema.shape) as (keyof PaymentFormValues)[],
];

export default function HomePageClient() {
  const [step, setStep] = useState(1);
  const [animationClass, setAnimationClass] = useState('animate-fade-in-up');
  const [headerAnimationClass, setHeaderAnimationClass] = useState('animate-fade-in-up');
  const [isHeaderRendered, setIsHeaderRendered] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const searchParams = useSearchParams();

  const [isLayoutCentered, setIsLayoutCentered] = useState(false);
  const [isAnimatingToStep9, setIsAnimatingToStep9] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(fullFormSchema),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      dob: '',
      ssn: '',
      differentOwner: 'no',
      gender: '',
      healthQuestion1: '',
      healthQuestion2: '',
      healthQuestion3: '',
      tobaccoUse: "",
      existingPolicies: "",
      effectiveDate: "",
      beneficiary1FirstName: "",
      beneficiary1LastName: "",
      beneficiary1Dob: "",
      beneficiary1Address: "",
      beneficiary1Apt: "",
      beneficiary1City: "",
      beneficiary1State: "",
      beneficiary1Zip: "",
      beneficiary1Relationship: "",
      beneficiary1Phone: "",
      contingentBeneficiaryCount: NaN,
      coverage: "",
      accountHolderName: "",
      accountNumber: "",
      routingNumber: "",
    },
  });

  const { formState: { errors } } = form;

  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const stepNumber = parseInt(stepParam, 10);
      if (!isNaN(stepNumber) && stepNumber >= 1 && stepNumber <= 9) {
        setStep(stepNumber);
        if (stepNumber >= 9) {
          setIsHeaderRendered(false);
          setIsLayoutCentered(true);
        }
      }
    }
  }, [searchParams]);

  const changeStep = (newStep: number) => {
    if (newStep === step) return;

    setIsAnimatingOut(true);
    setAnimationClass('animate-fade-out-down');
    
    if (newStep >= 9 && step < 9) {
      setHeaderAnimationClass('animate-fade-out-down');
      setIsAnimatingToStep9(true);
    }

    setTimeout(() => {
      if (newStep < 9 && step >= 9) {
        setIsHeaderRendered(true);
        setHeaderAnimationClass('animate-fade-in-up');
        setIsLayoutCentered(false);
      }
      
      setStep(newStep);
      setIsAnimatingOut(false);
      setAnimationClass('animate-fade-in-up');
      
      if (isAnimatingToStep9) {
        setIsHeaderRendered(false);
        setIsLayoutCentered(true);
        setIsAnimatingToStep9(false);
      } else if (newStep >= 9) {
        setIsHeaderRendered(false);
        setIsLayoutCentered(true);
      }

    }, 300);
  };
  
  const handleNext = async () => {
    const fields = stepFields[step - 1];
    const output = await form.trigger(fields, { shouldFocus: true });
    
    if (!output) return;
    
    changeStep(step + 1);
  };

  const handleBack = () => {
    changeStep(step - 1);
  };
  
  const processForm = (data: FormValues) => {
    console.log('Final Submission:', data);
    changeStep(step + 1); // Move to Thank You page
  };

  const goToNextStep = () => {
    changeStep(step + 1);
  }

  const handleStepChange = (newStep: number) => {
    changeStep(newStep);
  };

  const handleSelfEnroll = () => {
    changeStep(7);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <InsuranceForm />;
      case 2:
        return <AdditionalQuestionsForm />;
      case 3:
        return <BeneficiaryForm />;
      case 4:
        return <BeneficiaryAddressForm />;
      case 5:
        return <PaymentForm />;
      case 6:
        return <ThankYou onSelfEnroll={handleSelfEnroll} />;
      case 7:
        return <SelfEnrollLoading onComplete={goToNextStep} />;
      case 8:
        return <SelfEnrollContract onNext={goToNextStep} phoneNumber={form.getValues('phone')} />;
      case 9:
        return <SelfEnrollComplete />;
      default:
        return <InsuranceForm />;
    }
  };

  const showSubheading = step <= 6;
  const showNavigation = step >= 1 && step <= 5;

  const getErrorMessage = () => {
    if (step < 1 || step > stepFields.length) return null;
    const fields = stepFields[step - 1];
    if (!fields) return null;

    for (const field of fields) {
      if (errors[field]) {
        return errors[field]?.message as string;
      }
    }
    
    return null;
  }
  
  const errorMessage = getErrorMessage();

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground font-body">
      <header className="absolute top-0 left-0 p-8 md:p-12">
        <Logo />
      </header>

      <div className="absolute top-0 right-0 p-4 md:p-6 z-50">
        <div className="flex items-center gap-2 p-2 bg-card/50 rounded-lg shadow-lg">
          <span className="text-xs font-bold mr-2 hidden md:inline">DEV:</span>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleStepChange(num)}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                step === num 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground hover:bg-primary/80 hover:text-primary-foreground"
              )}
              aria-label={`Go to step ${num}`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center w-full px-8 sm:px-12 text-center">
        <div className={cn(
          "max-w-4xl w-full flex flex-col items-center flex-1 pt-24",
          isLayoutCentered && "justify-center pt-0"
        )}>
            <div className={cn(
              "flex flex-col items-center",
              headerAnimationClass,
              !isHeaderRendered && "hidden"
            )}>
              <Icon className="h-20 w-20 md:h-36 md:w-36 text-accent mb-2 md:mb-8" />
              <h1 className="font-headline text-3xl md:text-5xl tracking-tight mb-8 leading-tight max-w-2xl">
                  State and Congress Approved Final Expense Benefits Emergency Funds
              </h1>
              <p className={cn(
                "text-base text-foreground/80 mb-8 max-w-[55rem]",
                !showSubheading && "invisible"
              )}>
                {step === 6
                  ? "We have all of the information necessary. How would you like to complete your application?"
                  : "Amounts between $5,000 - $25,000 / Available to anyone ages 45-80"}
              </p>
            </div>

            <div className={cn(
              "w-full flex justify-center",
              isLayoutCentered && "flex-1 items-center",
            )}>
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(processForm)} className={cn("w-full", animationClass)}>
                  <div className={cn("w-full flex justify-center")}>
                    {renderStep()}
                  </div>

                  {showNavigation && (
                    <FormNavigation
                      onBack={handleBack}
                      onNext={handleNext}
                      backButton={step > 1}
                      isSubmit={step === 5}
                      actionLabel={step === 5 ? "SUBMIT" : "NEXT"}
                    >
                      {errorMessage && (
                        <p className="text-[10px] font-medium leading-tight text-destructive">
                          {errorMessage}
                        </p>
                      )}
                    </FormNavigation>
                  )}
                </form>
              </FormProvider>
            </div>
        </div>
      </main>

      <footer className="w-full py-8 text-center">
        <p className="text-xs text-foreground/60">
          All information provided is private and securely protected.
        </p>
      </footer>
    </div>
  );
}
