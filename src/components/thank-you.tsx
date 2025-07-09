'use client';

import { Separator } from "@/components/ui/separator";

interface ThankYouProps {
  onSelfEnroll: () => void;
}

export default function ThankYou({ onSelfEnroll }: ThankYouProps) {
  return (
    <div className="w-full max-w-4xl flex flex-col md:flex-row-reverse justify-center items-stretch gap-8 text-center">
      {/* Self-Enroll Card */}
      <div 
        onClick={onSelfEnroll}
        className="w-full md:w-1/2 p-8 bg-primary text-primary-foreground rounded-lg shadow-xl flex flex-col items-center transition-transform duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 cursor-pointer border-2 border-white"
      >
        <h2 className="font-headline text-3xl font-bold tracking-tight mb-4">Self-Enroll</h2>
        <Separator className="bg-primary-foreground/50 my-2 w-full" />
        <div className="my-4 h-8 flex items-center">
          <span className="bg-white text-primary text-xs font-bold px-4 py-2 rounded-full animate-grow-wiggle">
            2 MINUTES
          </span>
        </div>
        <p className="text-base px-4">
          Your application will be completed right now. No need to speak to an Agent.
        </p>
      </div>

      {/* Speak to an Agent Card */}
      <div className="w-full md:w-1/2 p-8 bg-card text-card-foreground border-2 border-primary rounded-lg shadow-xl flex flex-col items-center transition-transform duration-300 ease-in-out hover:scale-105 hover:-translate-y-1">
        <h2 className="font-headline text-3xl font-bold tracking-tight mb-4">Speak to an Agent</h2>
        <Separator className="bg-primary/50 my-2 w-full" />
        <div className="my-4 h-8 flex items-center">
          <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-full">
            5-10 MINUTES
          </span>
        </div>
        <p className="text-base px-4">
          An agent will call you to finalize your application and answer any questions.
        </p>
      </div>
    </div>
  );
}
