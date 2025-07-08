
# Next Starter Pro - Code Snapshot

This file contains a complete snapshot of all the code for your project. Your team can use this to recreate the project locally and push it to a new Git repository of your choice.

**This is a temporary measure to give you access to your code.**

For a better long-term workflow, it is highly recommended to create a new backend in Firebase App Hosting and connect it directly to your own GitHub repository.

---

### `apphosting.yaml`

```yaml
# Settings to manage and configure a Firebase App Hosting backend.
# https://firebase.google.com/docs/app-hosting/configure

runConfig:
  # Increase this value if you'd like to automatically spin up
  # more instances in response to increased traffic.
  maxInstances: 1
```

---

### `components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

---

### `next.config.ts`

```ts
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
```

---

### `package.json`

```json
{
  "name": "nextn",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "genkit:dev": "genkit start -- tsx src/ai/dev.ts",
    "genkit:watch": "genkit start -- tsx --watch src/ai/dev.ts",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@genkit-ai/googleai": "^1.13.0",
    "@genkit-ai/next": "^1.13.0",
    "@hookform/resolvers": "^4.1.3",
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-menubar": "^1.1.6",
    "@radix-ui/react-popover": "^1.1.6",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-radio-group": "^1.2.3",
    "@radix-ui/react-scroll-area": "^1.2.3",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slider": "^1.2.3",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toast": "^1.2.6",
    "@radix-ui/react-tooltip": "^1.1.8",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "dotenv": "^16.5.0",
    "embla-carousel-react": "^8.6.0",
    "firebase": "^11.9.1",
    "genkit": "^1.13.0",
    "lucide-react": "^0.475.0",
    "next": "15.3.5",
    "patch-package": "^8.0.0",
    "react": "19.1.0",
    "react-day-picker": "9.0.4",
    "react-dom": "19.1.0",
    "react-hook-form": "^7.54.2",
    "recharts": "^2.15.1",
    "tailwind-merge": "^3.0.1",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19.1.4",
    "@types/react-dom": "^19.1.0",
    "genkit-cli": "^1.13.0",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

---

### `tailwind.config.ts`

```ts
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['StyreneAWeb', 'sans-serif'],
        headline: ['StyreneAWeb', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'shake': {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
        'fade-in-up': {
          'from': { opacity: '0', transform: 'translateY(1rem)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-out-down': {
          'from': { opacity: '1', transform: 'translateY(0)' },
          'to': { opacity: '0', transform: 'translateY(1rem)' },
        },
        'grow-wiggle': {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '1%, 3%, 5%': { transform: 'scale(1.1) rotate(-2deg)' },
          '2%, 4%': { transform: 'scale(1.1) rotate(2deg)' },
          '6%': { transform: 'scale(1) rotate(0deg)' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'shake': 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
        'fade-in-up': 'fade-in-up 0.3s ease-out',
        'fade-out-down': 'fade-out-down 0.3s ease-out',
        'grow-wiggle': 'grow-wiggle 4.5s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
```

---

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

### `src/ai/dev.ts`

```ts
import { config } from 'dotenv';
config();
```

---

### `src/ai/genkit.ts`

```ts
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
```

---

### `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  @font-face {
    font-family: 'StyreneAWeb';
    src: url('/fonts/StyreneAWeb-Medium.ttf') format('truetype');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  :root {
    --background: 210 47% 97%; /* Very light Blue */
    --foreground: 224 71% 4%;
    --card: 0 0% 100%;
    --card-foreground: 224 71% 4%;
    --popover: 0 0% 100%;
    --popover-foreground: 224 71% 4%;
    --primary: 229 100% 65%; /* #4364FF */
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215 25% 27%;
    --accent: 14 100% 75%; /* #FF997F */
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 20 100% 50%;
    --destructive-foreground: 0 0% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 88%;
    --ring: 229 100% 65%; /* #4364FF */
    --radius: 0.5rem;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --sidebar-background: 210 47% 97%;
    --sidebar-foreground: 224 71% 4%;
    --sidebar-primary: 204 54% 77%;
    --sidebar-primary-foreground: 222.2 47.4% 11.2%;
    --sidebar-accent: 240 40% 94%;
    --sidebar-accent-foreground: 222.2 47.4% 11.2%;
    --sidebar-border: 214.3 31.8% 91.4%;
    --sidebar-ring: 204 54% 77%;
  }
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 229 100% 65%; /* #4364FF */
    --primary-foreground: 210 40% 98%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 14 100% 75%; /* #FF997F */
    --accent-foreground: 210 40% 98%;
    --destructive: 20 100% 55%;
    --destructive-foreground: 0 0% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 15%;
    --ring: 229 100% 65%; /* #4364FF */
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
    --sidebar-background: 222.2 84% 4.9%;
    --sidebar-foreground: 210 40% 98%;
    --sidebar-primary: 217.2 91.2% 59.8%;
    --sidebar-primary-foreground: 210 40% 98%;
    --sidebar-accent: 217.2 32.6% 17.5%;
    --sidebar-accent-foreground: 210 40% 98%;
    --sidebar-border: 217.2 32.6% 17.5%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 30px hsl(var(--card)) inset !important;
      -webkit-text-fill-color: hsl(var(--foreground)) !important;
      transition: background-color 5000s ease-in-out 0s;
  }
}
```

---

### `src/app/layout.tsx`

```tsx
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
```

---

### `src/components/additional-questions-form.tsx`

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import FormNavigation from '@/components/form-navigation';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  differentOwner: z.string().min(1, { message: "Please select an option." }),
  gender: z.string().min(1, { message: "Please select your gender." }),
  healthQuestion1: z.string().min(1, { message: "This question is required." }),
  healthQuestion2: z.string().min(1, { message: "This question is required." }),
  healthQuestion3: z.string().min(1, { message: "This question is required." }),
});

export type AdditionalQuestionsFormValues = z.infer<typeof formSchema>;

interface AdditionalQuestionsFormProps {
  onBack: () => void;
  onNext: (data: AdditionalQuestionsFormValues) => void;
}

export default function AdditionalQuestionsForm({ onBack, onNext }: AdditionalQuestionsFormProps) {
  const form = useForm<AdditionalQuestionsFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      differentOwner: 'no',
      gender: '',
      healthQuestion1: '',
      healthQuestion2: '',
      healthQuestion3: '',
    },
  });

  const { formState: { errors } } = form;

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="w-full max-w-2xl space-y-8">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="differentOwner"
            render={({ field }) => (
              <FormItem className={cn("space-y-3 p-6 bg-card/50 rounded-lg shadow-lg text-left border-2 border-transparent", errors.differentOwner && "border-destructive animate-shake")}>
                <FormLabel className="text-base font-semibold text-foreground">Is the policy owner different than the insured?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yes" className="border-foreground/80 border-2" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="no" className="border-foreground/80 border-2" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className={cn("space-y-3 p-6 bg-card/50 rounded-lg shadow-lg text-left border-2 border-transparent", errors.gender && "border-destructive animate-shake")}>
                <FormLabel className="text-base font-semibold text-foreground">Your gender?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="male" className="border-foreground/80 border-2" />
                      </FormControl>
                      <FormLabel className="font-normal">Male</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="female" className="border-foreground/80 border-2" />
                      </FormControl>
                      <FormLabel className="font-normal">Female</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="not-specified" className="border-foreground/80 border-2" />
                      </FormControl>
                      <FormLabel className="font-normal">Not specified</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="healthQuestion1"
            render={({ field }) => (
              <FormItem className={cn("space-y-3 p-6 bg-card/50 rounded-lg shadow-lg text-left border-2 border-transparent", errors.healthQuestion1 && "border-destructive animate-shake")}>
                <FormLabel className="text-base font-semibold text-foreground">Have you ever been diagnosed, treated, tested positive for, or been given any medical advice by a member of the medical profession for AIDS or HIV, Bipolar Disorder, Schizophrenia, Alzheimer's, Dementia, or other progressive neurological disorder? *</FormLabel>
                 <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yes" className="border-foreground/80 border-2" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="no" className="border-foreground/80 border-2" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="healthQuestion2"
            render={({ field }) => (
              <FormItem className={cn("space-y-3 p-6 bg-card/50 rounded-lg shadow-lg text-left border-2 border-transparent", errors.healthQuestion2 && "border-destructive animate-shake")}>
                <FormLabel className="text-base font-semibold text-foreground">Have you ever been diagnosed, treated, tested positive for, or been given any medical advice by a member of the medical profession for any condition that requires the use of oxygen or dialysis? *</FormLabel>
                 <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yes" className="border-foreground/80 border-2" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="no" className="border-foreground/80 border-2" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="healthQuestion3"
            render={({ field }) => (
              <FormItem className={cn("space-y-3 p-6 bg-card/50 rounded-lg shadow-lg text-left border-2 border-transparent", errors.healthQuestion3 && "border-destructive animate-shake")}>
                <FormLabel className="text-base font-semibold text-foreground">Within the last 5 years, have you been diagnosed with, hospitalized, treated by a licensed member of the medical profession for Cancer (except basal/squamous cell of the skin), Stroke, Heart Attack, Diabetes requiring insulin, Chronic Obstructive Pulmonary Disease (COPD), Chronic Hepatitis, Cirrhosis of the Liver, Alcohol or Drug Abuse, Pulmonary Arterial Hypertension or Hereditary Angioedema except those related to the Human Immunodeficiency Virus (HIV) or have you had any diagnostic testing that has not been completed for any of the conditions listed above? *</FormLabel>
                 <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yes" className="border-foreground/80 border-2" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="no" className="border-foreground/80 border-2" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormNavigation onBack={onBack} actionLabel="NEXT" backButton={true}>
          {hasErrors && (
            <p className="text-[10px] font-medium text-destructive leading-tight">
              All questions must be answered.
            </p>
          )}
        </FormNavigation>
      </form>
    </Form>
  );
}
```

---

### `src/components/beneficiary-address-form.tsx`

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormNavigation from '@/components/form-navigation';
import { cn, formatPhoneNumber } from '@/lib/utils';

const relationshipOptions = [
  "Aunt", "Brother", "Child", "Civil Union/Partner", "Cousin", "Dependent", 
  "Father", "Friend", "Grandfather", "Grandmother", "Guardian", "Mother", 
  "Parent", "Self", "Sister", "Spouse", "Stepbrother", "Stepfather", 
  "Stepmother", "Stepsister", "Uncle"
];

const formSchema = z.object({
  beneficiary1Address: z.string().min(1, { message: "Address is required." }),
  beneficiary1Apt: z.string().optional(),
  beneficiary1City: z.string().min(1, { message: "City is required." }),
  beneficiary1State: z.string().min(1, { message: "State is required." }),
  beneficiary1Zip: z.string().min(5, { message: "A valid zip code is required." }),
  beneficiary1Relationship: z.string().min(1, { message: "Relationship is required." }),
  beneficiary1Phone: z.string().min(14, { message: "Please enter a complete phone number." }),
  contingentBeneficiaryCount: z.coerce.number().min(0, { message: "Please enter a number." }).int(),
});

export type BeneficiaryAddressFormValues = z.infer<typeof formSchema>;

interface BeneficiaryAddressFormProps {
  onBack: () => void;
  onNext: (data: BeneficiaryAddressFormValues) => void;
}

export default function BeneficiaryAddressForm({ onBack, onNext }: BeneficiaryAddressFormProps) {
  const form = useForm<BeneficiaryAddressFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      beneficiary1Address: "",
      beneficiary1Apt: "",
      beneficiary1City: "",
      beneficiary1State: "",
      beneficiary1Zip: "",
      beneficiary1Relationship: "",
      beneficiary1Phone: "",
      contingentBeneficiaryCount: NaN,
    }
  });

  const { formState: { errors } } = form;
  const hasErrors = Object.keys(errors).length > 0;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    field.onChange(formatPhoneNumber(e.target.value));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="w-full max-w-2xl space-y-8">
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-foreground text-left">Primary Beneficiary 1 Address</h3>
          <FormField
            control={form.control}
            name="beneficiary1Address"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Street Address" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1Address && "border-destructive focus-visible:border-destructive animate-shake")} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="beneficiary1Apt"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Apt, suite, etc. (optional)" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1Apt && "border-destructive focus-visible:border-destructive animate-shake")} />
                    </FormControl>
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="beneficiary1City"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="City" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1City && "border-destructive focus-visible:border-destructive animate-shake")} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="beneficiary1State"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="State" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1State && "border-destructive focus-visible:border-destructive animate-shake")} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="beneficiary1Zip"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Zip Code" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1Zip && "border-destructive focus-visible:border-destructive animate-shake")} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <h3 className="text-base font-semibold text-foreground text-left pt-4">Primary Beneficiary 1 Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="beneficiary1Relationship"
              render={({ field }) => (
                <FormItem>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className={cn("h-auto py-4 bg-card shadow-xl text-base focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1Relationship && "border-destructive focus-visible:border-destructive animate-shake")}>
                        <SelectValue placeholder="Relationship to Insured" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {relationshipOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="beneficiary1Phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Mobile Number" {...field} onChange={(e) => handlePhoneChange(e, field)} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1Phone && "border-destructive focus-visible:border-destructive animate-shake")} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="contingentBeneficiaryCount"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || '')} value={isNaN(field.value) ? '' : field.value} placeholder="How many contingent beneficiaries?" className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.contingentBeneficiaryCount && "border-destructive focus-visible:border-destructive animate-shake")} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormNavigation onBack={onBack} actionLabel="NEXT" backButton={true}>
          {hasErrors && (
            <p className="text-[10px] font-medium text-destructive leading-tight">
              All questions must be answered.
            </p>
          )}
        </FormNavigation>
      </form>
    </Form>
  );
}
```

---

### `src/components/beneficiary-form.tsx`

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import FormNavigation from '@/components/form-navigation';
import { cn, formatDateInput } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

const formSchema = z.object({
  tobaccoUse: z.string().min(1, { message: 'This question is required.' }),
  existingPolicies: z.string().min(1, { message: 'This question is required.' }),
  effectiveDate: z.date({
    required_error: 'An effective date is required.',
  }),
  beneficiaryCount: z.coerce.number().min(1, { message: 'Please enter a number.' }).int(),
  beneficiary1FirstName: z.string().min(1, { message: "First name is required." }),
  beneficiary1LastName: z.string().min(1, { message: "Last name is required." }),
  beneficiary1Dob: z.string().min(10, { message: "Please enter a complete date of birth." }),
});

export type BeneficiaryFormValues = z.infer<typeof formSchema>;

interface BeneficiaryFormProps {
  onBack: () => void;
  onNext: (data: BeneficiaryFormValues) => void;
}

export default function BeneficiaryForm({ onBack, onNext }: BeneficiaryFormProps) {
  const form = useForm<BeneficiaryFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      tobaccoUse: "",
      existingPolicies: "",
      effectiveDate: new Date(),
      beneficiaryCount: NaN,
      beneficiary1FirstName: "",
      beneficiary1LastName: "",
      beneficiary1Dob: "",
    }
  });

  const { formState: { errors } } = form;
  const hasErrors = Object.keys(errors).length > 0;

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    field.onChange(formatDateInput(e.target.value));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="w-full max-w-2xl space-y-8">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="tobaccoUse"
            render={({ field }) => (
              <FormItem className={cn("space-y-3 p-6 bg-card/50 rounded-lg shadow-lg text-left border-2 border-transparent", errors.tobaccoUse && "border-destructive animate-shake")}>
                <FormLabel className="text-base font-semibold text-foreground">Has the proposed applicant used tobacco or nicotine in the last 12 months including cigarettes, cigars, chewing tobacco, vape, nicotine gum, or nicotine patch? *</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl><RadioGroupItem value="yes" className="border-foreground/80 border-2" /></FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl><RadioGroupItem value="no" className="border-foreground/80 border-2" /></FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="existingPolicies"
            render={({ field }) => (
              <FormItem className={cn("space-y-3 p-6 bg-card/50 rounded-lg shadow-lg text-left border-2 border-transparent", errors.existingPolicies && "border-destructive animate-shake")}>
                <FormLabel className="text-base font-semibold text-foreground">Does the proposed applicant have any existing life or annuity policies with Combined Insurance or any other company? *</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl><RadioGroupItem value="yes" className="border-foreground/80 border-2" /></FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl><RadioGroupItem value="no" className="border-foreground/80 border-2" /></FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <FormField
                control={form.control}
                name="effectiveDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-2">
                    <FormLabel className="text-left text-base font-semibold text-foreground">Desired effective date of this policy</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full h-auto py-4 pl-3 text-left font-normal bg-card shadow-xl text-base",
                              !field.value && "text-muted-foreground",
                              errors.effectiveDate && "border-destructive animate-shake"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span className="text-neutral-400">Select the desired effective date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setDate(new Date().getDate() - 1))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="beneficiaryCount"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || '')} value={isNaN(field.value) ? '' : field.value} placeholder="How many primary beneficiaries?" className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiaryCount && "border-destructive focus-visible:border-destructive animate-shake")} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          
            <h3 className="text-base font-semibold text-foreground text-left pt-4">Primary Beneficiary 1</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="beneficiary1FirstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Beneficiary First Name" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1FirstName && "border-destructive focus-visible:border-destructive animate-shake")} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="beneficiary1LastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Beneficiary Last Name" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1LastName && "border-destructive focus-visible:border-destructive animate-shake")} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="beneficiary1Dob"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Date of Birth (MM/DD/YYYY)" {...field} onChange={(e) => handleDateInputChange(e, field)} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.beneficiary1Dob && "border-destructive focus-visible:border-destructive animate-shake")} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormNavigation onBack={onBack} actionLabel="NEXT" backButton={true}>
          {hasErrors && (
            <p className="text-[10px] font-medium text-destructive leading-tight">
              All questions must be answered.
            </p>
          )}
        </FormNavigation>
      </form>
    </Form>
  );
}
```

---

### `src/components/form-navigation.tsx`

```tsx
'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface FormNavigationProps {
  onBack?: () => void;
  backButton?: boolean;
  actionLabel: string;
  children?: React.ReactNode;
}

export default function FormNavigation({
  onBack,
  backButton = false,
  actionLabel,
  children,
}: FormNavigationProps) {
  return (
    <div className="relative flex justify-between items-center mt-4">
      {backButton ? (
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="h-auto justify-between w-48 px-5 py-4 text-base font-body border-2 border-foreground/80 shadow-xl tracking-widest bg-black text-white hover:bg-black/90"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>BACK</span>
        </Button>
      ) : (
        <div className="w-48" /> // Spacer
      )}
      
      <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
        <div className="w-full max-w-[20vw]">
          <div className="min-h-[2.5rem] flex items-center justify-center text-center">
            {children}
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="h-auto justify-between w-48 px-5 py-4 text-base font-body border-2 border-white shadow-xl tracking-widest"
      >
        <span>{actionLabel}</span>
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
```

---

### `src/components/insurance-form.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { differenceInYears, parse, isValid } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import FormNavigation from '@/components/form-navigation';
import { cn, formatPhoneNumber, formatDateInput, formatSsn } from '@/lib/utils';

const isValidSsn = (ssn: string) => {
    const ssnParts = ssn.replace(/-/g, '');
    if (ssnParts.length !== 9) return true; // Let min validation handle length, we only care about structure here.

    const area = ssnParts.substring(0, 3);
    const group = ssnParts.substring(3, 5);
    const serial = ssnParts.substring(5, 9);
    
    // More robust validation based on SSA rules to better catch fakes.
    // Area number cannot be 000, 666, or in the 900-999 range.
    if (area === "000" || area === "666" || parseInt(area, 10) >= 900) {
        return false;
    }
    if (group === "00") {
        return false;
    }
    if (serial === "0000") {
        return false;
    }
    return true;
};

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  phone: z.string().min(14, { message: "Please enter a complete phone number." }),
  email: z.string().min(1, { message: "Email is required." }).email({ message: "Invalid email address." }),
  dob: z.string()
    .min(10, { message: "Please enter a complete date of birth." })
    .refine((dob) => {
        const parsedDate = parse(dob, 'MM/dd/yyyy', new Date());
        if (!isValid(parsedDate)) return false;

        const [month, day, year] = dob.split('/').map(Number);
        if (parsedDate.getFullYear() !== year || parsedDate.getMonth() !== month - 1 || parsedDate.getDate() !== day) {
            return false;
        }

        const age = differenceInYears(new Date(), parsedDate);
        return age >= 45 && age <= 80;
    }, {
        message: "You must be between 45 and 80 years old to be eligible."
    }),
  ssn: z.string()
    .min(11, { message: "Please enter a complete social security number." })
    .refine(isValidSsn, {
        message: "Please enter a valid social security number."
    }),
});

export type InsuranceFormValues = z.infer<typeof formSchema>;

interface InsuranceFormProps {
  onNext: (data: InsuranceFormValues) => void;
}

export default function InsuranceForm({ onNext }: InsuranceFormProps) {
  const form = useForm<InsuranceFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      dob: '',
      ssn: '',
    },
  });

  const { formState: { errors } } = form;
  const [ssnValidationState, setSsnValidationState] = useState<'idle' | 'validating' | 'valid'>('idle');
  const ssnValue = form.watch('ssn');

  useEffect(() => {
    const rawSsn = ssnValue.replace(/[^\d]/g, '');

    if (rawSsn.length < 9) {
      setSsnValidationState('idle');
      if (errors.ssn?.type === 'manual') {
        form.clearErrors('ssn');
      }
      return;
    }

    if (rawSsn.length === 9) {
      setSsnValidationState('validating');
      const timer = setTimeout(() => {
        if (isValidSsn(ssnValue)) {
          setSsnValidationState('valid');
          if (errors.ssn) {
            form.clearErrors('ssn');
          }
        } else {
          setSsnValidationState('idle');
          form.setError('ssn', { type: 'manual', message: 'Please enter a valid social security number.' });
        }
      }, 1000); // Simulate network latency

      return () => clearTimeout(timer);
    }
  }, [ssnValue, form, errors.ssn]);


  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    field.onChange(formatPhoneNumber(e.target.value));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    field.onChange(formatDateInput(e.target.value));
  };

  const handleSSNChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    field.onChange(formatSsn(e.target.value));
  };

  function getErrorMessage() {
    if (ssnValidationState === 'validating') return "One moment, validating SSN...";
    if (ssnValidationState === 'valid') return "SSN validated";
    if (errors.dob?.message) return errors.dob.message;
    if (errors.ssn?.message) return errors.ssn.message;
    if (Object.keys(errors).length > 0) return "Red fields must be entered correctly.";
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="w-full max-w-2xl space-y-8">
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="First Name" 
                        {...field} 
                        className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.firstName && "border-destructive focus-visible:border-destructive animate-shake")} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="Last Name" 
                        {...field} 
                        className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.lastName && "border-destructive focus-visible:border-destructive animate-shake")} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="Valid Phone Number" 
                        {...field} 
                        onChange={(e) => handlePhoneChange(e, field)} 
                        className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.phone && "border-destructive focus-visible:border-destructive animate-shake")} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="Email" 
                        type="email" 
                        {...field} 
                        className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.email && "border-destructive focus-visible:border-destructive animate-shake")} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="Date of Birth" 
                        {...field} 
                        onChange={(e) => handleDateChange(e, field)} 
                        className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.dob && "border-destructive focus-visible:border-destructive animate-shake")} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ssn"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="Social Security Number" 
                        {...field} 
                        onChange={(e) => handleSSNChange(e, field)} 
                        className={cn(
                          "h-auto py-4 bg-card shadow-xl focus-visible:ring-0 focus-visible:ring-offset-0",
                          errors.ssn
                              ? "border-destructive focus-visible:border-destructive animate-shake"
                              : "focus-visible:border-primary",
                          ssnValidationState === 'valid' && "border-primary focus-visible:border-primary"
                      )}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
        </div>
        <FormNavigation actionLabel="NEXT">
          {getErrorMessage() && (
            <p className={cn("text-[10px] font-medium leading-tight", (errors.dob || errors.ssn) ? "text-destructive" : "text-foreground")}>
              {getErrorMessage()}
            </p>
          )}
        </FormNavigation>
      </form>
    </Form>
  );
}
```

---

### `src/components/logo.tsx`

```tsx
'use client';
import { cn } from "@/lib/utils";

const Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="54"
    height="54"
    viewBox="0 0 54 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <ellipse cx="27" cy="27" rx="12" ry="24" transform="rotate(45 27 27)" stroke="currentColor" strokeWidth="3"/>
    <ellipse cx="27" cy="27" rx="12" ry="24" transform="rotate(-45 27 27)" stroke="currentColor" strokeWidth="3"/>
  </svg>
);


export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Icon className="h-16 w-16 text-accent" />
      <p className="text-foreground/80 tracking-tighter leading-tight">
        Simple, Safe
        <br />
        Insurance for
        <br />
        everyone.
      </p>
    </div>
  );
}

export { Icon };
```

---

### `src/components/payment-form.tsx`

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormNavigation from '@/components/form-navigation';
import { cn } from '@/lib/utils';

const coverageOptions = [
  "$10,000", "$12,000", "$14,000", "$16,000", "$18,000", "$20,000", "$25,000"
];

const formSchema = z.object({
  coverage: z.string().min(1, { message: "Coverage amount is required." }),
  accountHolderName: z.string().min(1, { message: "Account holder name is required." }),
  accountNumber: z.string().min(1, { message: "Account number is required." }),
  routingNumber: z.string().min(9, { message: "A valid 9-digit routing number is required." }).max(9, { message: "A valid 9-digit routing number is required." }),
});

export type PaymentFormValues = z.infer<typeof formSchema>;

interface PaymentFormProps {
  onBack: () => void;
  onSubmit: (data: PaymentFormValues) => void;
}

export default function PaymentForm({ onBack, onSubmit }: PaymentFormProps) {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      coverage: "",
      accountHolderName: "",
      accountNumber: "",
      routingNumber: "",
    }
  });

  const { formState: { errors } } = form;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl space-y-8">
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-foreground text-left">Coverage and Premium</h3>
          <FormField
            control={form.control}
            name="coverage"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={cn("h-auto py-4 bg-card shadow-xl text-base focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.coverage && "border-destructive focus-visible:border-destructive animate-shake")}>
                      <SelectValue placeholder="Select Coverage Amount" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {coverageOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-semibold text-foreground text-left">Payment Details</h3>
          <FormField
            control={form.control}
            name="accountHolderName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Account Holder Name" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.accountHolderName && "border-destructive focus-visible:border-destructive animate-shake")} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Account Number" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.accountNumber && "border-destructive focus-visible:border-destructive animate-shake")} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="routingNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Routing Number" {...field} className={cn("h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", errors.routingNumber && "border-destructive focus-visible:border-destructive animate-shake")} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormNavigation onBack={onBack} actionLabel="SUBMIT" backButton={true}>
          {hasErrors && (
            <p className="text-[10px] font-medium text-destructive leading-tight">
              All questions must be answered correctly.
            </p>
          )}
        </FormNavigation>
      </form>
    </Form>
  );
}
```

---

### `src/components/self-enroll-complete.tsx`

```tsx
'use client';

import { CheckCircle2 } from 'lucide-react';

export default function SelfEnrollComplete() {
  return (
    <div className="w-full max-w-xl flex flex-col items-center text-center space-y-8">
        <CheckCircle2 className="w-24 h-24 text-primary" />
        <h2 className="text-3xl font-bold tracking-tight">Congratulations!</h2>
        <p className="text-base text-foreground/80 max-w-md">
            Your application is complete and your policy is now active. You will receive an email confirmation shortly.
        </p>
    </div>
  );
}
```

---

### `src/components/self-enroll-contract.tsx`

```tsx
'use client';

import { Button } from '@/components/ui/button';

interface SelfEnrollContractProps {
  onNext: () => void;
}

export default function SelfEnrollContract({ onNext }: SelfEnrollContractProps) {
  return (
    <div className="w-full max-w-xl flex flex-col items-center text-center space-y-8 -mt-8">
      <p className="text-base text-foreground/80 max-w-md">
        A text message with a link to your contract has been sent. Please open it and complete the signature process.
      </p>
      <Button onClick={onNext} className="h-auto px-8 py-4 text-base font-body tracking-tight whitespace-normal w-full max-w-md">
        I have received the text and completed the contract
      </Button>
    </div>
  );
}
```

---

### `src/components/self-enroll-loading.tsx`

```tsx
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
```

---

### `src/components/thank-you.tsx`

```tsx
'use client';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ThankYouProps {
  onSelfEnroll: () => void;
}

export default function ThankYou({ onSelfEnroll }: ThankYouProps) {
  return (
    <div className="w-full max-w-4xl flex flex-col md:flex-row justify-center items-stretch gap-8 text-center">
      {/* Self-Enroll Card */}
      <div 
        onClick={onSelfEnroll}
        className="w-full md:w-1/2 p-8 bg-primary text-primary-foreground rounded-lg shadow-xl flex flex-col items-center transition-transform duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 cursor-pointer"
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
```

---

### `src/config/site.ts`

```ts
export const siteConfig = {
  name: 'Final Expense v2.0',
  description: 'Simplified final expense insurance application.',
};

export type SiteConfig = typeof siteConfig;
```

---

### `src/hooks/use-mobile.tsx`

```tsx
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
```

---

### `src/hooks/use-toast.ts`

```ts
"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
```

---

### `src/lib/utils.ts`

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPhoneNumber = (value: string) => {
  const rawValue = value.replace(/[^\d]/g, '');
  let formattedValue = '';
  if (rawValue.length > 0) {
    formattedValue = '(' + rawValue.substring(0, 3);
  }
  if (rawValue.length >= 4) {
    formattedValue += ') ' + rawValue.substring(3, 6);
  }
  if (rawValue.length >= 7) {
    formattedValue += '-' + rawValue.substring(6, 10);
  }
  return formattedValue;
};

export const formatDateInput = (value: string) => {
  const rawValue = value.replace(/[^\d]/g, '');
  let formattedValue = rawValue.substring(0, 2);
  if (rawValue.length > 2) {
    formattedValue += '/' + rawValue.substring(2, 4);
  }
  if (rawValue.length > 4) {
    formattedValue += '/' + rawValue.substring(4, 8);
  }
  return formattedValue;
};

export const formatSsn = (value: string) => {
  const rawValue = value.replace(/[^\d]/g, '');
  let formattedValue = rawValue.substring(0, 3);
  if (rawValue.length > 3) {
    formattedValue += '-' + rawValue.substring(3, 5);
  }
  if (rawValue.length > 5) {
    formattedValue += '-' + rawValue.substring(5, 9);
  }
  return formattedValue;
};
```
