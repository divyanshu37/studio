
'use client';

import { Button } from '@/components/ui/button';

interface DevStepperProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  totalSteps: number;
}

export default function DevStepper({ currentStep, onStepChange, totalSteps }: DevStepperProps) {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-card p-2 rounded-lg shadow-lg border text-left">
      <h4 className="text-xs font-bold mb-2 text-foreground px-1">Dev Stepper</h4>
      <div className="grid grid-cols-5 gap-1">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <Button
            key={step}
            variant={currentStep === step ? 'default' : 'outline'}
            size="icon"
            onClick={() => onStepChange(step)}
            className="h-8 w-8"
          >
            {step}
          </Button>
        ))}
      </div>
    </div>
  );
}
