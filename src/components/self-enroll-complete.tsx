'use client';

import { CheckCircle2 } from 'lucide-react';

export default function SelfEnrollComplete() {
  return (
    <div className="w-full max-w-xl flex flex-col items-center text-center space-y-8">
        <CheckCircle2 className="w-24 h-24 text-primary" />
        <h2 className="text-3xl font-bold tracking-tight">Congratulations!</h2>
        <p className="text-base text-foreground/80 max-w-md">
            Your application is complete and your policy is now active. You will receive an email confirmation shortly.
        </p>
    </div>
  );
}
