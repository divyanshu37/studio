'use client';

export default function WithAgent() {
  return (
    <div className="w-full max-w-xl flex flex-col items-center text-center space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Thank You!</h2>
      <p className="text-base text-foreground/80 max-w-md">
        An agent will be in contact with you shortly to finalize your application.
      </p>
    </div>
  );
}
