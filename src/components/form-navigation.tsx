
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormNavigationProps {
  onBack?: () => void;
  onNext?: () => void;
  isSubmit?: boolean;
  backButton?: boolean;
  actionLabel: string;
  disabled?: boolean;
  errorMessage?: string | null;
}

export default function FormNavigation({
  onBack,
  onNext,
  isSubmit = false,
  backButton = false,
  actionLabel,
  disabled = false,
  errorMessage = null,
}: FormNavigationProps) {
  const [currentError, setCurrentError] = useState<string | null>(errorMessage);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setCurrentError(errorMessage);
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 5000); // Hide after 5 seconds
      return () => clearTimeout(timer);
    } else {
      setShowError(false);
    }
  }, [errorMessage]);

  const handleCloseError = () => {
    setShowError(false);
  };

  return (
    <div className="relative flex flex-wrap justify-between items-center mt-8 w-full gap-y-4">
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
        <div className="w-48 hidden sm:block" /> // Spacer
      )}
      
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full max-w-xs md:max-w-sm px-2 order-3 sm:order-2">
        <div
          className={cn(
            "transition-all duration-300 ease-in-out transform flex justify-center items-center",
            showError ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
            "w-full"
          )}
        >
          {currentError && (
            <div className="bg-destructive text-destructive-foreground text-xs font-semibold px-4 py-2 rounded-lg shadow-md flex items-center gap-2 w-full text-center">
              <span className="flex-1 text-left">{currentError}</span>
              <button type="button" onClick={handleCloseError} className="shrink-0">
                <XCircle className="h-4 w-4" />
                <span className="sr-only">Close error message</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <Button
        type={isSubmit ? 'submit' : 'button'}
        onClick={!isSubmit ? onNext : undefined}
        className="h-auto justify-between w-48 px-5 py-4 text-base font-body border-2 border-white shadow-xl tracking-widest order-2 sm:order-3"
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
