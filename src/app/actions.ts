'use server';

import axios from 'axios';

const PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place';
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

interface Prediction {
  description: string;
  place_id: string;
}

export async function getPlaceAutocomplete(input: string): Promise<Prediction[]> {
  if (!API_KEY) {
    throw new Error('Google Places API key is not configured.');
  }
  if (!input) {
    return [];
  }

  const params = {
    input,
    key: API_KEY,
    types: 'address',
    components: 'country:us',
  };

  try {
    const response = await axios.get(`${PLACES_API_URL}/autocomplete/json`, { params });
    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      console.error('Places API Error:', response.data.error_message);
      throw new Error(response.data.error_message || 'Failed to fetch autocomplete suggestions.');
    }
    return response.data.predictions;
  } catch (error) {
    console.error('Error calling Places Autocomplete API:', error);
    throw new Error('Could not fetch address suggestions.');
  }
}

export async function getPlaceDetails(placeId: string) {
    if (!API_KEY) {
        throw new Error('Google Places API key is not configured.');
    }

    const params = {
        place_id: placeId,
        key: API_KEY,
        fields: 'address_components',
    };

    try {
        const response = await axios.get(`${PLACES_API_URL}/details/json`, { params });
        if (response.data.status !== 'OK') {
             console.error('Place Details API Error:', response.data.error_message);
            throw new Error(response.data.error_message || 'Failed to fetch place details.');
        }
        return response.data.result;
    } catch (error) {
        console.error('Error calling Place Details API:', error);
        throw new Error('Could not fetch place details.');
    }
}
