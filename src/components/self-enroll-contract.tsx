'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquareText } from 'lucide-react';

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

  const last4Digits = phoneNumber ? phoneNumber.slice(-4) : 'XXXX';

  return (
    <div className="w-full max-w-xl flex flex-col items-center text-center space-y-8 -mt-8">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="items-center text-center">
            <MessageSquareText className="w-12 h-12 text-primary mb-4" />
            <CardTitle className="text-2xl">Text Message Sent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <p className="text-base text-foreground/80">
                A text message with a link to your contract has been sent to the number ending in <span className="font-bold text-foreground">...{last4Digits}</span>.
            </p>
            <div className="text-center">
                <p className="text-sm text-muted-foreground">Your PIN to unlock the link is:</p>
                <div className="bg-muted rounded-lg p-4 mt-2 inline-block">
                    <p className="text-3xl font-bold tracking-widest text-foreground">{pin || '----'}</p>
                </div>
            </div>
             <p className="text-xs text-foreground/60 max-w-sm mx-auto">
                Please open the text message and follow the link to complete the signature process.
            </p>
        </CardContent>
      </Card>

      <Button onClick={onNext} className="h-auto px-8 py-4 text-base font-body tracking-tight whitespace-normal w-full max-w-md">
        I have received the text and completed the contract
      </Button>
    </div>
  );
}
