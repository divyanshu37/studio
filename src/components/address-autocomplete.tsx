
'use client';

import usePlacesAutocomplete, { getGeocode, getZipCode, getLatLng } from 'use-places-autocomplete';
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
    },
    debounce: 300,
  });

  const { setValue: setFormValue, trigger, formState: { errors } } = useFormContext();

  // Pre-fill the input with any existing address data
  useEffect(() => {
    if (!value) {
        // You can pre-fill it here if you have initial data, e.g.
        // setValue(getValues('addressStreet'));
    }
  }, [setValue]);


  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSelect = ({ description, place_id }: { description: string, place_id: string }) => async () => {
    setValue(description, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ placeId: place_id });
      const { lat, lng } = await getLatLng(results[0]);
      
      let streetNumber = '';
      let route = '';
      let city = '';
      let state = '';
      let zipCode = '';
      let aptNumber = '';

      // Extract address components
      for (const component of results[0].address_components) {
        const componentType = component.types[0];
        switch (componentType) {
          case 'street_number':
            streetNumber = component.long_name;
            break;
          case 'route':
            route = component.short_name;
            break;
          case 'locality':
            city = component.long_name;
            break;
          case 'administrative_area_level_1':
            state = component.short_name;
            break;
          case 'postal_code':
            zipCode = component.long_name;
            break;
          case 'subpremise':
            aptNumber = component.long_name;
            break;
        }
      }
      
      // Update form values
      setFormValue('addressStreet', `${streetNumber} ${route}`, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      setFormValue('addressCity', city, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      setFormValue('addressState', state, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      setFormValue('addressZip', zipCode, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      setFormValue('addressApt', aptNumber, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      
      // Manually trigger validation for all address fields after setting them
      trigger(['addressStreet', 'addressCity', 'addressState', 'addressZip']);

    } catch (error) {
      console.log('😱 Error: ', error);
    }
  };

  const renderSuggestions = () =>
    data.map((suggestion) => {
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
    });

  return (
    <div className="relative w-full">
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
      {status === 'OK' && (
        <ul className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto text-left">
          {renderSuggestions()}
        </ul>
      )}
    </div>
  );
}
