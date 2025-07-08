'use client';

import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';

interface SelfEnrollContractProps {
  onNext: () => void;
  phoneNumber?: string;
}

export default function SelfEnrollContract({ onNext, phoneNumber }: SelfEnrollContractProps) {
  const [pin, setPin] = useState('');

  useEffect(() => {
    // Generate a random 4-digit PIN on the client to avoid hydration mismatch
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    setPin(newPin);
  }, []);

  const last4Digits = phoneNumber ? phoneNumber.replace(/[^\d]/g, '').slice(-4) : '2523';
  const maskedPhoneNumber = `***-***-${last4Digits}`;

  return (
    <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Phone Verification</h2>
      <p className="text-base text-foreground/80 max-w-xs">
        Please check your mobile device and sign the agreement
      </p>

      <div className="w-full space-y-3 text-left">
        <div className="bg-card rounded-lg p-4 border shadow-sm">
          <p className="text-sm text-muted-foreground">Check your phone ending with:</p>
          <p className="text-xl font-semibold tracking-wider text-foreground mt-1">{maskedPhoneNumber}</p>
        </div>
        
        <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
          <p className="text-sm text-primary">Access PIN:</p>
          <p className="text-4xl font-bold tracking-widest text-primary mt-1">{pin || '----'}</p>
        </div>

        <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
            <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent-foreground/80" />
                <p className="text-sm font-semibold text-accent-foreground">Agreement Required</p>
            </div>
            <p className="text-sm text-accent-foreground/80 mt-2">
              Please review and sign the agreement on your mobile device using the PIN above.
            </p>
        </div>
      </div>
    </div>
  );
}
