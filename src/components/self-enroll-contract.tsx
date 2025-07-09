
'use client';

interface SelfEnrollContractProps {
  pin?: string;
  phoneLastFour?: string;
}

export default function SelfEnrollContract({ pin, phoneLastFour }: SelfEnrollContractProps) {
  const maskedPhoneNumber = `***-***-${phoneLastFour || 'XXXX'}`;

  return (
    <div className="w-full max-w-2xl flex flex-col items-center text-center">
      <h2 className="text-2xl font-bold tracking-tight mb-2">Phone Verification</h2>
      <p className="text-base text-foreground/80 max-w-lg mb-6">
        A text with a link to sign has been sent. Please use the PIN below to access it.
      </p>

      <div className="w-full flex gap-4 text-left mb-6">
        <div className="flex-1 bg-card rounded-lg p-4 border shadow-sm">
          <p className="text-sm text-muted-foreground">Verification code sent to phone ending in:</p>
          <p className="text-xl font-semibold tracking-wider text-foreground mt-1">{maskedPhoneNumber}</p>
        </div>
        
        <div className="flex-1 bg-primary/10 rounded-lg p-4 border border-primary/20">
          <p className="text-sm text-primary">Access PIN:</p>
          <p className="text-4xl font-bold tracking-widest text-primary mt-1">{pin || '----'}</p>
        </div>
      </div>
       <p className="text-sm text-foreground/60 max-w-lg">
        Waiting for confirmation... this page will advance automatically.
      </p>
    </div>
  );
}
