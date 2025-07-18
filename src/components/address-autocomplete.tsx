
'use client';

import { useState, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { getPlaceAutocomplete, getPlaceDetails } from '@/app/actions';

interface Suggestion {
  description: string;
  place_id: string;
}

export default function AddressAutocomplete() {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { setValue: setFormValue, trigger, formState: { errors } } = useFormContext();
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    if (value.length > 2) {
        setIsSearching(true);
        searchTimeout.current = setTimeout(async () => {
            try {
                const results = await getPlaceAutocomplete(value);
                setSuggestions(results);
            } catch (error) {
                console.error("Error fetching place suggestions:", error);
                setSuggestions([]);
            } finally {
                setIsSearching(false);
            }
        }, 300); // Debounce for 300ms
    } else {
        setSuggestions([]);
    }
  };

  const handleSelectSuggestion = async (placeId: string, description: string) => {
    setInputValue(description);
    setSuggestions([]);

    try {
      const details = await getPlaceDetails(placeId);
      if (details) {
        setFormValue('addressStreet', details.street, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        setFormValue('addressCity', details.city, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        setFormValue('addressState', details.state, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        setFormValue('addressZip', details.zip, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        setFormValue('addressApt', details.apt, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        
        trigger(['addressStreet', 'addressCity', 'addressState', 'addressZip']);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  return (
    <div className="relative w-full" onBlur={() => setTimeout(() => setIsFocused(false), 100)}>
      <Input
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        placeholder="Applicant's Primary Address"
        autoComplete="off"
        className={cn(
          "h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0",
          (errors.addressStreet || errors.addressCity || errors.addressState || errors.addressZip) && "border-destructive focus-visible:border-destructive animate-shake"
        )}
      />
      {isFocused && (isSearching || suggestions.length > 0) && (
        <ul className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto text-left">
          {isSearching && !suggestions.length && <li className="p-2 text-muted-foreground">Searching...</li>}
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onMouseDown={() => handleSelectSuggestion(suggestion.place_id, suggestion.description)}
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
