import { CheckCircle } from 'lucide-react';

export default function ThankYou() {
  return (
    <div className="text-center">
      <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
      <h2 className="font-headline text-3xl md:text-4xl tracking-tight mb-4">Thank You!</h2>
      <p className="text-base text-foreground/80">
        Your information has been submitted successfully. We will be in touch shortly.
      </p>
    </div>
  );
}
