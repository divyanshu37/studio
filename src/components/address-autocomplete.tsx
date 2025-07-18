
'use client';

import usePlacesAutocomplete, { getGeocode, getZipCode } from 'use-places-autocomplete';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

export default function AddressAutocomplete() {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'us' },
      types: ['address'],
    },
    debounce: 300,
  });

  const { setValue: setFormValue, trigger, formState: { errors } } = useFormContext();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSelect = ({ description }: { description: string }) => async () => {
    setValue(description, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = results[0].geometry.location;

      let streetNumber = '';
      let route = '';
      let city = '';
      let state = '';
      let zip = '';
      let apt = '';

      results[0].address_components.forEach(component => {
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
      console.error('Error getting address details: ', error);
    }
  };

  const renderSuggestions = () => {
    if (status !== 'OK') {
      return null;
    }
    return (
      <ul className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto text-left">
        {data.map(suggestion => {
          const {
            place_id,
            structured_formatting: { main_text, secondary_text },
          } = suggestion;
          return (
            <li
              key={place_id}
              onClick={handleSelect(suggestion)}
              className="p-2 hover:bg-muted cursor-pointer rounded-md"
            >
              <strong>{main_text}</strong> <small>{secondary_text}</small>
            </li>
          );
        })}
      </ul>
    );
  };
  
  // Set the initial value for the input field if the form already has a street value.
  // This is useful for when the user navigates back to this step.
  useEffect(() => {
    const street = setFormValue('addressStreet');
    if (street) {
        setValue(street, false);
    }
  }, [setValue]);


  return (
    <div className="relative w-full" onBlur={() => setTimeout(() => clearSuggestions(), 100)}>
      <Input
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Applicant's Primary Address"
        autoComplete="off"
        className={cn(
          "h-auto py-4 bg-card shadow-xl focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0",
          (errors.addressStreet || errors.addressCity || errors.addressState || errors.addressZip) && "border-destructive focus-visible:border-destructive animate-shake"
        )}
      />
      {status === 'OK' && renderSuggestions()}
    </div>
  );
}
