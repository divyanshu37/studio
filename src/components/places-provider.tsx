
'use client';

import { useLoadScript } from '@react-google-maps/api';
import React, { ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const libraries: ('places')[] = ['places'];

export default function PlacesProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    console.error('Google Places API key is not configured.');
    // You might want to render an error message to the user here.
    return <div>Address functionality is unavailable due to a configuration error.</div>;
  }

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  if (loadError) {
    console.error('Failed to load Google Maps script', loadError);
    toast({
      variant: 'destructive',
      title: 'Address Finder Failed',
      description: 'Could not load Google Maps. Please refresh the page or contact support.',
    });
    // You might want to render a fallback UI
    return <>{children}</>;
  }
  
  if (!isLoaded) {
    return (
        <div className="flex flex-col items-center justify-center h-40">
           <div className="relative w-12 h-12">
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
          <p className="mt-4 text-muted-foreground">Initializing Address Finder...</p>
        </div>
      );
  }

  return <>{children}</>;
}
