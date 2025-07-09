'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface FormNavigationProps {
  onBack?: () => void;
  onNext?: () => void;
  isSubmit?: boolean;
  backButton?: boolean;
  actionLabel: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export default function FormNavigation({
  onBack,
  onNext,
  isSubmit = false,
  backButton = false,
  actionLabel,
  disabled = false,
  children,
}: FormNavigationProps) {
  return (
    <div className="relative flex justify-between items-center mt-8">
      {backButton ? (
        <Button
          type="button"
          onClick={onBack}
          variant="black"
          className="h-auto justify-between w-48 px-5 py-4 text-base font-body border-2 border-white shadow-xl tracking-widest"
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
        disabled={disabled}
      >
        <span>{actionLabel}</span>
        {isSubmit && disabled ? (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <ArrowRight className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}
