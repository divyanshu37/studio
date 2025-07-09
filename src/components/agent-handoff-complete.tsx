'use client';

import { CheckCircle2 } from 'lucide-react';

export default function AgentHandoffComplete() {
  return (
    <div className="w-full max-w-xl flex flex-col items-center text-center space-y-8">
        <CheckCircle2 className="w-24 h-24 text-primary" />
        <h2 className="text-3xl font-bold tracking-tight">Congratulations!</h2>
        <p className="text-base text-foreground/80 max-w-md">
            Your application is complete and you're ready to go. You will receive a call from an agent within the next few days to help answer any questions and finalize your policy!
        </p>
    </div>
  );
}
