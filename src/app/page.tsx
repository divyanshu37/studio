'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Logo, Icon } from '@/components/logo';
import InsuranceForm, { type InsuranceFormValues } from '@/components/insurance-form';
import AdditionalQuestionsForm, { type AdditionalQuestionsFormValues } from '@/components/additional-questions-form';
import BeneficiaryForm, { type BeneficiaryFormValues } from '@/components/beneficiary-form';
import BeneficiaryAddressForm, { type BeneficiaryAddressFormValues } from '@/components/beneficiary-address-form';
import PaymentForm, { type PaymentFormValues } from '@/components/payment-form';
import ThankYou from '@/components/thank-you';
import FormNavigation from '@/components/form-navigation';
import { cn } from '@/lib/utils';

export type FormValues = Partial<InsuranceFormValues & AdditionalQuestionsFormValues & BeneficiaryFormValues & BeneficiaryAddressFormValues & PaymentFormValues>;

export default function Home() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormValues>({});
  const [animationClass, setAnimationClass] = useState('animate-fade-in-up');
  const searchParams = useSearchParams();

  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const stepNumber = parseInt(stepParam, 10);
      if (!isNaN(stepNumber) && stepNumber >= 1 && stepNumber <= 6) {
        setStep(stepNumber);
      }
    }
  }, [searchParams]);

  const handleNextStep = (data: Partial<FormValues>) => {
    setFormData(prev => ({ ...prev, ...data }));
    setAnimationClass('animate-fade-out-down');
    setTimeout(() => {
      setStep(prevStep => prevStep + 1);
      setAnimationClass('animate-fade-in-up');
    }, 300);
  };

  const handleBack = () => {
    setAnimationClass('animate-fade-out-down');
    setTimeout(() => {
      setStep(step - 1);
      setAnimationClass('animate-fade-in-up');
    }, 300);
  };
  
  const handleSubmit = (data: PaymentFormValues) => {
    const finalData: FormValues = { ...formData, ...data };
    console.log('Final Submission:', finalData);
    handleNextStep(data);
  };

  const handleStepChange = (newStep: number) => {
    if (newStep === step) return;
    setAnimationClass('animate-fade-out-down');
    setTimeout(() => {
      setStep(newStep);
      setAnimationClass('animate-fade-in-up');
    }, 300);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <InsuranceForm onNext={handleNextStep} />;
      case 2:
        return <AdditionalQuestionsForm onBack={handleBack} onNext={handleNextStep} />;
      case 3:
        return <BeneficiaryForm onBack={handleBack} onNext={handleNextStep} />;
      case 4:
        return <BeneficiaryAddressForm onBack={handleBack} onNext={handleNextStep} />;
      case 5:
        return <PaymentForm onBack={handleBack} onSubmit={handleSubmit} />;
      case 6:
        return <ThankYou />;
      default:
        return <InsuranceForm onNext={handleNextStep} />;
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground font-body">
      <header className="absolute top-0 left-0 p-8 md:p-12">
        <Logo />
      </header>

      {/* Temporary Step Navigator */}
      <div className="absolute top-0 right-0 p-4 md:p-6 z-50">
        <div className="flex items-center gap-2 p-2 bg-card/50 rounded-lg shadow-lg">
          <span className="text-xs font-bold mr-2 hidden md:inline">DEV:</span>
          {[1, 2, 3, 4, 5, 6].map((num) => (
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


      <main className="flex flex-col items-center justify-center flex-1 w-full px-4 py-24 text-center">
        <div className="max-w-4xl w-full flex flex-col items-center">
            <Icon className="h-48 w-48 text-accent mb-8" />
            <h1 className="font-headline text-4xl md:text-5xl tracking-tight mb-8 leading-tight max-w-2xl">
                State and Congress Approved Final Expense Benefits Emergency Funds
            </h1>
            {step < 6 ? (
              <p className="text-base text-foreground/80 mb-8 max-w-xl">
                Amounts between $5,000 - $25,000 / Available to anyone ages 45-80
              </p>
            ) : (
              <p className="text-base text-foreground/80 mb-8 max-w-xl">
                We have all of the information necessary. How would you
                like to complete your application?
              </p>
            )}
            <div className={cn("w-full flex justify-center", animationClass)}>
              {renderStep()}
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
