import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
      </head>
      <body className="font-body antialiased font-medium" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
