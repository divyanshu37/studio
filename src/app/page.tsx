import { Logo, Icon } from '@/components/logo';
import InsuranceForm from '@/components/insurance-form';

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground font-body">
      <header className="absolute top-0 left-0 p-8 md:p-12">
        <Logo />
      </header>

      <main className="flex flex-col items-center justify-center flex-1 w-full px-4 py-24 text-center">
        <div className="max-w-3xl w-full flex flex-col items-center">
            <Icon className="h-16 w-16 text-accent mb-8" />
            <h1 className="font-headline text-4xl md:text-5xl tracking-tight mb-8 leading-tight">
                State and Congress Approved Final Expense Benefits Emergency Funds
            </h1>
            <p className="text-base text-foreground/80 mb-8">
                Amounts between $5,000 - $25,000 / Available to anyone ages 45-80
            </p>
            <InsuranceForm />
        </div>
      </main>

      <footer className="w-full py-8 text-center">
        <p className="text-xs text-foreground/60">
          All information provided is private and securely protected.
        </p>
      </footer>
    </div>
  );
}
