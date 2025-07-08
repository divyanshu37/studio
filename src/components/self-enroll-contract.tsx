
'use client';

import { useState, useEffect } from 'react';

interface SelfEnrollContractProps {
  phoneNumber?: string;
}

export default function SelfEnrollContract({ phoneNumber }: SelfEnrollContractProps) {
  const [generatedPin, setGeneratedPin] = useState('');

  useEffect(() => {
    // Generate a random 4-digit PIN on the client to avoid hydration mismatch
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedPin(newPin);
  }, []);

  const last4Digits = phoneNumber ? phoneNumber.replace(/[^\d]/g, '').slice(-4) : '2523';
  const maskedPhoneNumber = `***-***-${last4Digits}`;

  return (
    <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Phone Verification</h2>
      <p className="text-base text-foreground/80 max-w-xs">
        A text with a link to sign has been sent. Please use the PIN below to access it.
      </p>

      <div className="w-full space-y-3 text-left">
        <div className="bg-card rounded-lg p-4 border shadow-sm">
          <p className="text-sm text-muted-foreground">Verification code sent to phone ending in:</p>
          <p className="text-xl font-semibold tracking-wider text-foreground mt-1">{maskedPhoneNumber}</p>
        </div>
        
        <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
          <p className="text-sm text-primary">Access PIN:</p>
          <p className="text-4xl font-bold tracking-widest text-primary mt-1">{generatedPin || '----'}</p>
        </div>
      </div>
       <p className="text-sm text-foreground/60 max-w-xs">
        Waiting for confirmation... this page will advance automatically.
      </p>
    </div>
  );
}
