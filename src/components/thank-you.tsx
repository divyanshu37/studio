'use client';

import { Separator } from "@/components/ui/separator";

interface ThankYouProps {
  onSelfEnroll: () => void;
}

export default function ThankYou({ onSelfEnroll }: ThankYouProps) {
  return (
    <div className="w-full max-w-lg flex justify-center text-center">
      <div 
        onClick={onSelfEnroll}
        className="p-8 bg-primary text-primary-foreground rounded-lg shadow-xl flex flex-col items-center transition-transform duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 cursor-pointer">
        <h2 className="font-headline text-3xl font-bold tracking-tight mb-4">Self-Enroll</h2>
        <Separator className="bg-primary-foreground/50 my-2 w-full" />
        <div className="my-4">
          <span className="bg-white text-primary text-xs font-bold px-4 py-2 rounded-full animate-grow-wiggle">
            2 MINUTES
          </span>
        </div>
        <p className="text-base px-4">
          Your application will be completed right now. No need to speak to an Agent.
        </p>
      </div>
    </div>
  );
}
