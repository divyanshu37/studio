'use client';

import { useEffect } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getZipCode,
} from 'use-places-autocomplete';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function AddressAutocomplete() {
  const { setValue: setFormValue, trigger, formState: { errors } } = useFormContext();
  const { toast } = useToast();

  const {
    ready,
    value,
    suggestions: { status, data, loading },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'us' },
    },
    debounce: 300,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = results[0].geometry.location;
      const zipCode = await getZipCode({ lat, lng }, false);

      let streetNumber = '';
      let route = '';
      let city = '';
      let state = '';
      
      results[0].address_components.forEach(component => {
        const types = component.types;
        if (types.includes('street_number')) streetNumber = component.long_name;
        if (types.includes('route')) route = component.short_name;
        if (types.includes('locality')) city = component.long_name;
        if (types.includes('administrative_area_level_1')) state = component.short_name;
      });

      setFormValue('addressStreet', `${streetNumber} ${route}`.trim(), { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      setFormValue('addressCity', city, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      setFormValue('addressState', state, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      setFormValue('addressZip', zipCode || '', { shouldValidate: true, shouldDirty: true, shouldTouch: true });

      trigger(['addressStreet', 'addressCity', 'addressState', 'addressZip']);

    } catch (error) {
      console.error('Error fetching address details:', error);
      toast({
        variant: 'destructive',
        title: 'Could Not Get Address Details',
        description: 'Please fill in the city, state, and ZIP code fields manually.',
      });
    }
  };

  useEffect(() => {
    if (!ready) {
      // The hook will be re-enabled once the script is loaded
      // by the parent component (HomePageClient).
    }
  }, [ready]);
  
  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          value={value}
          onChange={handleInputChange}
          disabled={!ready}
          placeholder={ready ? "Applicant's Primary Address" : "Loading Address Finder..."}
          autoComplete="off"
          className={cn(
            "h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0",
            (errors.addressStreet || errors.addressCity || errors.addressState || errors.addressZip) && "border-destructive focus-visible:border-destructive animate-shake"
          )}
        />
         {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
        )}
      </div>

      {status === 'OK' && (
        <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto text-left">
          <ul className="p-0 m-0">
            {data.map(({ place_id, description }) => (
              <li
                key={place_id}
                onClick={() => handleSelect(description)}
                className="p-2 hover:bg-muted cursor-pointer rounded-md"
              >
                {description}
              </li>
            ))}
          </ul>
        </div>
      )}
       {status === 'ZERO_RESULTS' && (
         <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg p-2 text-sm text-muted-foreground">
           No results found. Please try a different address.
        </div>
      )}
    </div>
  );
}
