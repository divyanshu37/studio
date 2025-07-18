'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { getPlaceAutocomplete, getPlaceDetails } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface Suggestion {
  description: string;
  place_id: string;
}

export default function AddressAutocomplete() {
  const { setValue: setFormValue, trigger, formState: { errors } } = useFormContext();
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelectionMade, setIsSelectionMade] = useState(false);
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  const debounce = (func: Function, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const fetchSuggestions = useCallback(
    debounce(async (input: string) => {
      if (!input || isSelectionMade) {
        setSuggestions([]);
        setShowSuggestions(false);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const results = await getPlaceAutocomplete(input);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Autocomplete error:", error);
        toast({
          variant: 'destructive',
          title: 'Address Search Failed',
          description: 'Could not fetch address suggestions. Please enter your address manually.',
        });
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [isSelectionMade, toast]
  );

  useEffect(() => {
    fetchSuggestions(inputValue);
  }, [inputValue, fetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = async (suggestion: Suggestion) => {
    setInputValue(suggestion.description);
    setShowSuggestions(false);
    setIsSelectionMade(true);

    try {
      const result = await getPlaceDetails(suggestion.place_id);
      const components = result.address_components;
      
      let streetNumber = '';
      let route = '';
      let city = '';
      let state = '';
      let zip = '';
      let apt = '';

      components.forEach((component: any) => {
        const types = component.types;
        if (types.includes('street_number')) streetNumber = component.long_name;
        if (types.includes('route')) route = component.short_name;
        if (types.includes('locality')) city = component.long_name;
        if (types.includes('administrative_area_level_1')) state = component.short_name;
        if (types.includes('postal_code')) zip = component.long_name;
        if (types.includes('subpremise')) apt = component.long_name;
      });

      setFormValue('addressStreet', `${streetNumber} ${route}`.trim(), { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      setFormValue('addressApt', apt, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      setFormValue('addressCity', city, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      setFormValue('addressState', state, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      setFormValue('addressZip', zip, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      
      trigger(['addressStreet', 'addressCity', 'addressState', 'addressZip']);

    } catch (error) {
        console.error("Place Details error:", error);
        toast({
            variant: 'destructive',
            title: 'Could Not Get Address Details',
            description: 'Please fill in the city, state, and ZIP code fields manually.',
        });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (isSelectionMade) {
      setIsSelectionMade(false); 
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Applicant's Primary Address"
          autoComplete="off"
          className={cn(
            "h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0",
            (errors.addressStreet || errors.addressCity || errors.addressState || errors.addressZip) && "border-destructive focus-visible:border-destructive animate-shake"
          )}
        />
        {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
        )}
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto text-left">
          {suggestions.map(suggestion => (
            <li
              key={suggestion.place_id}
              onClick={() => handleSelect(suggestion)}
              className="p-2 hover:bg-muted cursor-pointer rounded-md"
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
