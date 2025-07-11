
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm, FormProvider, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { 
  fullFormSchema, 
  insuranceFormSchema, 
  additionalQuestionsObjectSchema,
  beneficiaryFormSchema, 
  paymentFormSchema,
  type FormValues,
  type InsuranceFormValues,
  type AdditionalQuestionsFormValues,
  type BeneficiaryFormValues,
  type PaymentFormValues
} from '@/lib/schema';
import { submitApplication } from '@/ai/flows/submit-application-flow';
import { submitLead } from '@/ai/flows/submit-lead-flow';
import { submitApplicationLead } from '@/ai/flows/submit-application-lead-flow';
import { logTraffic } from '@/ai/flows/log-traffic-flow';
import { useToast } from '@/hooks/use-toast';
import { useSocket } from '@/hooks/use-socket';

import { Logo, Icon } from '@/components/logo';
import InsuranceForm from '@/components/insurance-form';
import AdditionalQuestionsForm from '@/components/additional-questions-form';
import BeneficiaryForm from '@/components/beneficiary-form';
import PaymentForm from '@/components/payment-form';
import ThankYou from '@/components/thank-you';
import SelfEnrollLoading from '@/components/self-enroll-loading';
import SelfEnrollContract from '@/components/self-enroll-contract';
import SelfEnrollComplete from '@/components/self-enroll-complete';
import AgentHandoffComplete from '@/components/agent-handoff-complete';
import FormNavigation from '@/components/form-navigation';
import { cn } from '@/lib/utils';

const stepFields: (keyof FormValues)[][] = [
  Object.keys(insuranceFormSchema.shape) as (keyof InsuranceFormValues)[],
  Object.keys(additionalQuestionsObjectSchema.shape) as (keyof AdditionalQuestionsFormValues)[],
  Object.keys(beneficiaryFormSchema.shape) as (keyof BeneficiaryFormValues)[],
  Object.keys(paymentFormSchema.shape) as (keyof PaymentFormValues)[],
];

export default function HomePageClient({ uuid }: { uuid: string }) {
  const [step, setStep] = useState(1);
  const [animationClass, setAnimationClass] = useState('animate-fade-in-up');
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pin, setPin] = useState('');
  const [phoneLastFour, setPhoneLastFour] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(fullFormSchema),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      dob: '',
      lastFour: '',
      gender: '',
      differentOwner: 'no',
      healthQuestion1: 'no',
      healthQuestion2: 'no',
      healthQuestion3: 'no',
      tobaccoUse: 'no',
      existingPolicies: 'no',
      otherHealthIssues: 'no',
      otherHealthIssuesDetails: '',
      addressStreet: "",
      addressApt: "",
      addressCity: "",
      addressState: "",
      addressZip: "",
      effectiveDate: "",
      beneficiaryFirstName: "",
      beneficiaryLastName: "",
      beneficiaryPhone: "",
      beneficiaryDob: "",
      beneficiaryRelation: "",
      faceAmount: "",
      paymentAccountHolderName: "",
      paymentAccountNumber: "",
      paymentRoutingNumber: "",
    },
  });

  const { formState: { errors } } = form;

  const changeStep = useCallback((newStep: number) => {
    if (newStep === step) return;

    logTraffic({ uuid, step: newStep });

    setIsAnimatingOut(true);
    setAnimationClass('animate-fade-out-down');

    setTimeout(() => {
      setStep(newStep);
      setIsAnimatingOut(false);
      setAnimationClass('animate-fade-in-up');
    }, 300);
  }, [step, uuid]);
  
  useEffect(() => {
    logTraffic({ uuid, step: 1 });
  }, [uuid]);

  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const stepNumber = parseInt(stepParam, 10);
      if (!isNaN(stepNumber) && stepNumber >= 1 && stepNumber <= 9) {
        changeStep(stepNumber);
      }
    }
  }, [searchParams, changeStep]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === '5') {
        event.preventDefault();
        router.push('/admin');
      }
      if (process.env.NODE_ENV === 'development') {
        if (event.ctrlKey && event.shiftKey && event.key === 'R') {
          event.preventDefault();
          window.location.reload();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [router]);
  
  const handleNext = async () => {
    const fields = stepFields[step - 1];
    const output = await form.trigger(fields, { shouldFocus: true });
    
    if (!output) return;
    
    if (step === 3) {
      // This is the integration point for LEAD_URL
      // We don't await this or handle errors in the UI, it's a "fire-and-forget" call
      submitLead(form.getValues());
    }

    if (step === 4) {
      form.handleSubmit(processForm)();
    } else {
      changeStep(step + 1);
    }
  };

  const handleBack = () => {
    changeStep(step - 1);
  };
  
  const processForm = async (data: FormValues) => {
    // This is the integration point for APPLICATION_LEAD_URL
    // We don't await this or handle errors in the UI, it's a "fire-and-forget" call
    submitApplicationLead(data);
    changeStep(5);
  };
  
  const handleSelfEnrollSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await submitApplication({ ...data, referenceId: uuid });

      if (result.success) {
        changeStep(6);
      } else {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: result.message,
        });
        changeStep(5);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An unexpected error occurred.",
        description: "Please try again later.",
      });
      changeStep(5);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelfEnrollError = (formErrors: FieldErrors<FormValues>) => {
    toast({
      variant: "destructive",
      title: "Incomplete Application",
      description: "Please complete all required fields before submitting.",
    });
    
    const firstErrorField = Object.keys(formErrors)[0] as keyof FormValues;
    const stepWithError = stepFields.findIndex(fields => fields.includes(firstErrorField));
    
    if (stepWithError !== -1) {
      changeStep(stepWithError + 1);
    }
  };

  const handleSpeakToAgent = () => {
    changeStep(9);
  };
  
  const handleSocketUpdate = useCallback((data: any) => {
    if (data.error) {
       toast({
          variant: "destructive",
          title: data.error.title,
          description: data.error.message,
       });
       changeStep(5);
       return;
    }

    if (data.msg && typeof data.msg === 'string') {
        try {
            const payload = JSON.parse(data.msg);
            const { currentStep, pin, phoneLastFour, isError, error } = payload;
            
            if (pin) setPin(pin);
            if (phoneLastFour) setPhoneLastFour(phoneLastFour);

            if (currentStep === 'sms-verification' || currentStep === 'CONTRACT_READY') {
              changeStep(7);
            } else if (currentStep === 'ENROLLMENT_COMPLETE' || currentStep === 'processing' || currentStep === 'RESULT_SUCCESS') {
              changeStep(8);
            } else if (currentStep === 'RESULT_FAILED' || (isError && error)) {
                toast({
                    variant: "destructive",
                    title: "Enrollment Failed",
                    description: error || "An error occurred during enrollment.",
                });
                changeStep(5);
            }
        } catch (e) {
            console.error("Error parsing socket message", e);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Received an invalid message from the server."
            });
            changeStep(5);
        }
    }
  }, [changeStep, toast]);

  const subscribeId = (step >= 6 && step <= 7) ? uuid : null;
  useSocket(subscribeId, handleSocketUpdate);

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
        return <PaymentForm />;
      case 5:
        return <ThankYou onSelfEnroll={() => form.handleSubmit(handleSelfEnrollSubmit, handleSelfEnrollError)()} onSpeakToAgent={handleSpeakToAgent} />;
      case 6:
        return <SelfEnrollLoading />;
      case 7:
        return <SelfEnrollContract pin={pin} phoneLastFour={phoneLastFour} />;
      case 8:
        return <SelfEnrollComplete />;
      case 9:
        return <AgentHandoffComplete />;
      default:
        return <InsuranceForm />;
    }
  };

  const showHeader = step <= 5;
  const showNavigation = step >= 1 && step <= 4;

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
      <header className="absolute top-0 left-0 p-8 md:p-12 hidden md:block">
        <Logo />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full px-8 sm:px-12 text-center">
        <div className="max-w-4xl w-full flex flex-col items-center">
            {showHeader && (
              <div className="flex flex-col items-center pt-24">
                <Icon className="h-20 w-20 md:h-36 md:w-36 text-accent mb-2 md:mb-8" />
                <h1 className="font-headline text-3xl md:text-5xl tracking-tight mb-8 leading-tight max-w-2xl">
                    State and Congress Approved Final Expense Benefits Emergency Funds
                </h1>
                <p className="text-base text-foreground/80 mb-8 max-w-[55rem]">
                  {step === 5
                    ? "We have all of the information necessary. How would you like to complete your application?"
                    : "Amounts between $5,000 - $25,000 / Available to anyone ages 45-80"}
                </p>
              </div>
            )}

            <div className="w-full flex justify-center">
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(processForm)} className={cn("w-full flex flex-col items-center", animationClass)}>
                  {renderStep()}

                  {showNavigation && (
                    <div className="w-full max-w-2xl">
                        <FormNavigation
                        onBack={handleBack}
                        onNext={handleNext}
                        backButton={step > 1}
                        isSubmit={step === 4}
                        actionLabel={step === 4 ? "SUBMIT" : "NEXT"}
                        disabled={isSubmitting}
                        errorMessage={errorMessage}
                        />
                    </div>
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
