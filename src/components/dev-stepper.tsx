
'use client';

import { Button } from '@/components/ui/button';
import { ALL_STEPS, getStepNumber, StepId } from '@/lib/steps';

interface DevStepperProps {
  currentStep: StepId;
  onStepChange: (step: StepId) => void;
}

export default function DevStepper({ currentStep, onStepChange }: DevStepperProps) {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-card p-2 rounded-lg shadow-lg border text-left">
      <h4 className="text-xs font-bold mb-2 text-foreground px-1">Dev Stepper</h4>
      <div className="grid grid-cols-4 gap-1">
        {ALL_STEPS.map((stepId) => (
          <Button
            key={stepId}
            variant={currentStep === stepId ? 'default' : 'outline'}
            size="icon"
            onClick={() => onStepChange(stepId)}
            className="h-8 w-8"
            title={stepId}
          >
            {getStepNumber(stepId)}
          </Button>
        ))}
      </div>
    </div>
  );
}
