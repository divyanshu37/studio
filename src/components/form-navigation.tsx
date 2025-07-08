
'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface FormNavigationProps {
  onBack?: () => void;
  onNext?: () => void;
  isSubmit?: boolean;
  backButton?: boolean;
  actionLabel: string;
  children?: React.ReactNode;
}

export default function FormNavigation({
  onBack,
  onNext,
  isSubmit = false,
  backButton = false,
  actionLabel,
  children,
}: FormNavigationProps) {
  return (
    <div className="relative flex justify-between items-center mt-8">
      {backButton ? (
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="h-auto justify-between w-48 px-5 py-4 text-base font-body border-2 border-foreground/80 shadow-xl tracking-widest bg-black text-white hover:bg-black/90"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>BACK</span>
        </Button>
      ) : (
        <div className="w-48" /> // Spacer
      )}
      
      <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
        <div className="w-full max-w-[20vw]">
          <div className="min-h-[2.5rem] flex items-center justify-center text-center">
            {children}
          </div>
        </div>
      </div>

      <Button
        type={isSubmit ? 'submit' : 'button'}
        onClick={!isSubmit ? onNext : undefined}
        className="h-auto justify-between w-48 px-5 py-4 text-base font-body border-2 border-white shadow-xl tracking-widest"
      >
        <span>{actionLabel}</span>
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
