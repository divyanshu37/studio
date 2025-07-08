import { siteConfig } from '@/config/site';
import AIContactForm from '@/components/ai-contact-form';
import Header from '@/components/layout/header';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <section id="welcome" className="container mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter mb-4">{siteConfig.welcomeMessage}</h1>
          <p className="max-w-3xl mx-auto text-muted-foreground md:text-xl">{siteConfig.welcomeSubtitle}</p>
        </section>

        <Separator />

        <section id="ai-assistant" className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold font-headline text-center mb-2">AI Contact Info Assistant</h2>
                <p className="text-muted-foreground text-center mb-8">
                    Let our AI create a contact card for you. Just specify the role and working hours.
                </p>
                <AIContactForm />
            </div>
        </section>
      </main>
      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                Built with Next.js and a touch of AI.
            </p>
        </div>
      </footer>
    </div>
  );
}
