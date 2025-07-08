'use client';

import { Button } from '@/components/ui/button';

interface SelfEnrollContractProps {
  onNext: () => void;
}

export default function SelfEnrollContract({ onNext }: SelfEnrollContractProps) {
  return (
    <div className="w-full max-w-xl flex flex-col items-center text-center space-y-8">
      <p className="text-base text-foreground/80 max-w-md">
        A text message with a link to your contract has been sent. Please open it and complete the signature process.
      </p>
      <Button onClick={onNext} className="h-auto px-8 py-4 text-base font-body tracking-widest">
        I have received the text and completed the contract
      </Button>
    </div>
  );
}
