'use client';

import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

interface SelfEnrollLoadingProps {
  onComplete: () => void;
}

export default function SelfEnrollLoading({ onComplete }: SelfEnrollLoadingProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="w-full max-w-xl flex flex-col items-center text-center space-y-8 -mt-8">
      <Badge variant="secondary" className="px-6 py-2 text-base font-semibold rounded-full bg-black text-white hover:bg-black/90">
        Self-Enrolling
      </Badge>
      <p className="text-base text-foreground/80 max-w-md">
        We've started the process of completing your application!
        Keep this page open. In approximately 30 seconds, you will
        recieve a text with a code. Please have your phone ready.
      </p>
      <div className="relative w-24 h-24">
        <svg
          className="animate-spin h-full w-full text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 100 100"
        >
          <path
            d="M 50,10 A 40,40 0 1 1 10,50"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
