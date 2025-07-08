import { siteConfig } from '@/config/site';
import { Bot } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Bot className="h-6 w-6 mr-2 text-primary" />
          <span className="font-bold font-headline text-lg">{siteConfig.name}</span>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium ml-auto">
          <a href="#welcome" className="transition-colors hover:text-primary text-foreground/80">Home</a>
          <a href="#ai-assistant" className="transition-colors hover:text-primary text-foreground/80">AI Assistant</a>
        </nav>
      </div>
    </header>
  );
}
