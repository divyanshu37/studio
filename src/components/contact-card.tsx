import type { GenerateContactInfoOutput } from '@/ai/flows/generate-contact-info';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, Mail } from 'lucide-react';

interface ContactCardProps {
  contact: GenerateContactInfoOutput;
}

export function ContactCard({ contact }: ContactCardProps) {
  const initials = contact.name.split(' ').map(n => n[0]).join('');

  return (
    <Card className="w-full transition-all duration-500 ease-in-out transform hover:shadow-xl hover:-translate-y-1 bg-card border-primary/20 shadow-lg shadow-primary/10">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={`https://placehold.co/128x128.png`} alt={contact.name} data-ai-hint="person portrait" />
            <AvatarFallback className="bg-primary/20">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="font-headline text-2xl">{contact.name}</CardTitle>
            <CardDescription className="text-muted-foreground">{contact.bio}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-4 border-t border-border mt-4">
        <div className="flex items-center text-sm">
          <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
          <a href={`mailto:${contact.email}`} className="text-primary hover:underline">{contact.email}</a>
        </div>
        <div className="flex items-center text-sm">
          <Phone className="w-4 h-4 mr-3 text-muted-foreground" />
          <span>{contact.phone}</span>
        </div>
      </CardContent>
    </Card>
  );
}
