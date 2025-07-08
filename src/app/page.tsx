'use client';

import { useState } from 'react';
import { Logo, Icon } from '@/components/logo';
import InsuranceForm, { type InsuranceFormValues } from '@/components/insurance-form';
import AdditionalQuestionsForm, { type AdditionalQuestionsFormValues } from '@/components/additional-questions-form';
import BeneficiaryForm, { type BeneficiaryFormValues } from '@/components/beneficiary-form';
import ThankYou from '@/components/thank-you';
import { cn } from '@/lib/utils';

export default function Home() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [animationClass, setAnimationClass] = useState('animate-fade-in-up');

  const handleNextStep1 = (data: InsuranceFormValues) => {
    setFormData(prev => ({ ...prev, ...data }));
    setAnimationClass('animate-fade-out-down');
    setTimeout(() => {
      setStep(2);
      setAnimationClass('animate-fade-in-up');
    }, 300);
  };
  
  const handleNextStep2 = (data: AdditionalQuestionsFormValues) => {
    setFormData(prev => ({ ...prev, ...data }));
    setAnimationClass('animate-fade-out-down');
    setTimeout(() => {
      setStep(3);
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
  
  const handleSubmit = (data: BeneficiaryFormValues) => {
    const finalData = { ...formData, ...data };
    console.log('Final Submission:', finalData);
    setAnimationClass('animate-fade-out-down');
    setTimeout(() => {
      setStep(4);
      setAnimationClass('animate-fade-in-up');
    }, 300);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <InsuranceForm onNext={handleNextStep1} />;
      case 2:
        return <AdditionalQuestionsForm onBack={handleBack} onNext={handleNextStep2} />;
      case 3:
        return <BeneficiaryForm onBack={handleBack} onSubmit={handleSubmit} />;
      case 4:
        return <ThankYou />;
      default:
        return <InsuranceForm onNext={handleNextStep1} />;
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground font-body">
      <header className="absolute top-0 left-0 p-8 md:p-12">
        <Logo />
      </header>

      <main className="flex flex-col items-center justify-center flex-1 w-full px-4 py-24 text-center">
        <div className="max-w-3xl w-full flex flex-col items-center">
            <Icon className="h-24 w-24 text-accent mb-8" />
            <h1 className="font-headline text-4xl md:text-5xl tracking-tight mb-8 leading-tight">
                State and Congress Approved Final Expense Benefits Emergency Funds
            </h1>
            <p className="text-base text-foreground/80 mb-8">
                Amounts between $5,000 - $25,000 / Available to anyone ages 45-80
            </p>
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
