
'use server';

import axios from 'axios';

const PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
const DETAILS_API_URL = 'https://maps.googleapis.com/maps/api/place/details/json';
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

export async function getPlaceAutocomplete(input: string) {
  if (!API_KEY) {
    throw new Error('Google Places API key is not configured.');
  }

  try {
    const response = await axios.get(PLACES_API_URL, {
      params: {
        input,
        key: API_KEY,
        components: 'country:us',
        types: 'address',
      },
    });

    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API Error:', response.data.error_message);
      throw new Error(response.data.error_message || 'Failed to fetch suggestions.');
    }

    return response.data.predictions || [];
  } catch (error) {
    console.error('Error calling Places Autocomplete API:', error);
    throw new Error('Could not fetch address suggestions.');
  }
}

export async function getPlaceDetails(placeId: string) {
    if (!API_KEY) {
        throw new Error('Google Places API key is not configured.');
    }

    try {
        const response = await axios.get(DETAILS_API_URL, {
            params: {
                place_id: placeId,
                key: API_KEY,
                fields: 'address_components',
            },
        });

        if (response.data.status !== 'OK') {
            console.error('Google Place Details API Error:', response.data.error_message);
            throw new Error(response.data.error_message || 'Failed to fetch place details.');
        }
        
        const components = response.data.result.address_components;
        const address = {
            street: '',
            apt: '',
            city: '',
            state: '',
            zip: '',
        };

        let streetNumber = '';
        let route = '';

        for (const component of components) {
            const type = component.types[0];
            switch (type) {
                case 'street_number':
                    streetNumber = component.long_name;
                    break;
                case 'route':
                    route = component.short_name;
                    break;
                case 'locality':
                    address.city = component.long_name;
                    break;
                case 'administrative_area_level_1':
                    address.state = component.short_name;
                    break;
                case 'postal_code':
                    address.zip = component.long_name;
                    break;
                case 'subpremise':
                    address.apt = component.long_name;
                    break;
            }
        }
        
        address.street = `${streetNumber} ${route}`.trim();

        return address;

    } catch (error) {
        console.error('Error calling Place Details API:', error);
        throw new Error('Could not fetch address details.');
    }
}
