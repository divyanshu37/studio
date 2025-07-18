
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
    <div className="fixed bottom-4 right-4 z-50 bg-card p-4 rounded-lg shadow-lg border text-left">
      <h4 className="text-sm font-bold mb-2 text-foreground">Dev Stepper</h4>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <Button
            key={step}
            variant={currentStep === step ? 'default' : 'outline'}
            size="sm"
            onClick={() => onStepChange(step)}
            className="w-20"
          >
            Step {step}
          </Button>
        ))}
      </div>
    </div>
  );
}
