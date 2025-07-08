
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm, FormProvider, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { 
  fullFormSchema, 
  insuranceFormSchema, 
  additionalQuestionsFormSchema, 
  beneficiaryFormSchema, 
  beneficiaryAddressFormSchema, 
  paymentFormSchema,
  type FormValues,
  type InsuranceFormValues,
  type AdditionalQuestionsFormValues,
  type BeneficiaryFormValues,
  type BeneficiaryAddressFormValues,
  type PaymentFormValues
} from '@/lib/schema';
import { submitApplication } from '@/ai/flows/submit-application-flow';
import { useToast } from '@/hooks/use-toast';

import { Logo, Icon } from '@/components/logo';
import InsuranceForm from '@/components/insurance-form';
import AdditionalQuestionsForm from '@/components/additional-questions-form';
import BeneficiaryForm from '@/components/beneficiary-form';
import BeneficiaryAddressForm from '@/components/beneficiary-address-form';
import PaymentForm from '@/components/payment-form';
import ThankYou from '@/components/thank-you';
import SelfEnrollLoading from '@/components/self-enroll-loading';
import SelfEnrollContract from '@/components/self-enroll-contract';
import SelfEnrollComplete from '@/components/self-enroll-complete';
import FormNavigation from '@/components/form-navigation';
import { cn } from '@/lib/utils';

const stepFields: (keyof FormValues)[][] = [
  Object.keys(insuranceFormSchema.shape) as (keyof InsuranceFormValues)[],
  Object.keys(additionalQuestionsFormSchema.shape) as (keyof AdditionalQuestionsFormValues)[],
  Object.keys(beneficiaryFormSchema.shape) as (keyof BeneficiaryFormValues)[],
  Object.keys(beneficiaryAddressFormSchema.shape) as (keyof BeneficiaryAddressFormValues)[],
  Object.keys(paymentFormSchema.shape) as (keyof PaymentFormValues)[],
];

export default function HomePageClient({ uuid }: { uuid: string }) {
  const [step, setStep] = useState(1);
  const [animationClass, setAnimationClass] = useState('animate-fade-in-up');
  const [headerAnimationClass, setHeaderAnimationClass] = useState('animate-fade-in-up');
  const [isHeaderRendered, setIsHeaderRendered] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const ws = useRef<WebSocket | null>(null);

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
      gender: '',
      healthQuestion1: '',
      healthQuestion2: '',
      healthQuestion3: '',
      tobaccoUse: "",
      existingPolicies: "",
      effectiveDate: "",
      applicantAddress: "",
      applicantApt: "",
      applicantCity: "",
      applicantState: "",
      applicantZip: "",
      beneficiary1FirstName: "",
      beneficiary1LastName: "",
      beneficiary1Dob: "",
      beneficiary1Relationship: "",
      beneficiary1Phone: "",
      beneficiaryAddress: "",
      beneficiaryApt: "",
      beneficiaryCity: "",
      beneficiaryState: "",
      beneficiaryZip: "",
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
    
    if (step === 5) {
      form.handleSubmit(processForm)();
    } else {
      changeStep(step + 1);
    }
  };

  const handleBack = () => {
    changeStep(step - 1);
  };
  
  const processForm = async (data: FormValues) => {
    // This is called on step 5's submit, after validation
    console.log('Form data collected:', data);
    changeStep(6); // Go to Thank You page
  };
  
  const handleSelfEnrollSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      console.log('Submitting self-enroll with validated data:', data);
      const result = await submitApplication({ ...data, referenceId: uuid });

      if (result.success) {
        changeStep(7); // Move to loading page
      } else {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: result.message,
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        variant: "destructive",
        title: "An unexpected error occurred.",
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelfEnrollError = (formErrors: FieldErrors<FormValues>) => {
    console.error('Form validation failed on self-enroll:', formErrors);
    toast({
      variant: "destructive",
      title: "Incomplete Application",
      description: "Please complete all required fields before submitting.",
    });
    
    // Find the first field with an error and navigate to its step
    const firstErrorField = Object.keys(formErrors)[0] as keyof FormValues;
    const stepWithError = stepFields.findIndex(fields => fields.includes(firstErrorField));
    
    if (stepWithError !== -1) {
      changeStep(stepWithError + 1);
    }
  };


  useEffect(() => {
    if (step === 7 && uuid && !ws.current) {
      const websocketUrl = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/${uuid}`;
      console.log(`Connecting to WebSocket at ${websocketUrl}`);
      ws.current = new WebSocket(websocketUrl);

      ws.current.onopen = () => {
        console.log('WebSocket connection established');
      };

      ws.current.onmessage = (event) => {
        const message = event.data;
        console.log('WebSocket message received:', message);
        if (message === 'CONTRACT_READY') {
          changeStep(8);
        } else if (message === 'ENROLLMENT_COMPLETE') {
          changeStep(9);
          ws.current?.close();
        }
      };

      ws.current.onclose = () => {
        console.log('WebSocket connection closed');
        ws.current = null;
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Could not connect to the enrollment service. Please try again later.",
        });
        changeStep(6); // Go back to the choice page on error
      };
    }

  }, [step, uuid, toast]);

  // Cleanup WebSocket on component unmount
  useEffect(() => {
    return () => {
      ws.current?.close();
    };
  }, []);

  const handleStepChange = (newStep: number) => {
    changeStep(newStep);
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
        return <ThankYou onSelfEnroll={() => form.handleSubmit(handleSelfEnrollSubmit, handleSelfEnrollError)()} />;
      case 7:
        return <SelfEnrollLoading />;
      case 8:
        return <SelfEnrollContract phoneNumber={form.getValues('phone')} />;
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
                      disabled={isSubmitting}
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
