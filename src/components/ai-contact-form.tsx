'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getAIContactInfo } from '@/app/actions';
import type { GenerateContactInfoOutput } from '@/ai/flows/generate-contact-info';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ContactCard } from './contact-card';
import { ContactCardSkeleton } from './contact-card-skeleton';
import { Sparkles, Check, X } from 'lucide-react';

const formSchema = z.object({
  role: z.string().min(3, { message: "Role must be at least 3 characters long." }).max(50),
  availability: z.string().min(5, { message: "Availability must be at least 5 characters long." }).max(100),
});

export default function AIContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContact, setGeneratedContact] = useState<GenerateContactInfoOutput | null>(null);
  const [approvedContact, setApprovedContact] = useState<GenerateContactInfoOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: '',
      availability: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedContact(null);
    setApprovedContact(null);
    try {
      const result = await getAIContactInfo(values);
      setGeneratedContact(result);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate contact information. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleApprove = () => {
    if (generatedContact) {
      setApprovedContact(generatedContact);
      setGeneratedContact(null);
      toast({
        title: 'Success!',
        description: 'Contact card has been approved and added.',
      });
    }
  };

  const handleDiscard = () => {
    setGeneratedContact(null);
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg shadow-primary/10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="font-headline">Generate Contact Card</CardTitle>
              <CardDescription>Fill out the details below to generate a contact card using AI.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Sales Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Mon-Fri 9am-5pm EST" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="bg-primary/80 hover:bg-primary text-primary-foreground">
                <Sparkles className="mr-2 h-4 w-4" />
                {isLoading ? 'Generating...' : 'Generate with AI'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      <div className="min-h-[250px] flex items-center justify-center">
        {isLoading && <ContactCardSkeleton />}
        
        {generatedContact && (
          <div className="w-full space-y-4 animate-in fade-in-50 duration-500">
            <h3 className="text-center font-headline text-lg">AI Generated Preview</h3>
            <ContactCard contact={generatedContact} />
            <div className="flex justify-center space-x-4">
              <Button onClick={handleApprove}>
                <Check className="mr-2 h-4 w-4" /> Approve
              </Button>
              <Button onClick={handleDiscard} variant="outline">
                <X className="mr-2 h-4 w-4" /> Discard
              </Button>
            </div>
          </div>
        )}

        {approvedContact && (
          <div className="w-full space-y-4 animate-in fade-in-50 duration-500">
             <h3 className="text-center font-headline text-lg text-green-600">Approved Contact Card</h3>
            <ContactCard contact={approvedContact} />
          </div>
        )}
      </div>
    </div>
  );
}
