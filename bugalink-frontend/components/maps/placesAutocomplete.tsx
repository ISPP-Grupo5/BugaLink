import {
  useLoadScript,
  GoogleMap,
  MarkerF,
  CircleF,
} from '@react-google-maps/api';
import type { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import styles from '../styles/Home.module.css';

export default function PlacesAutocomplete({
  onAddressSelect,
  placeholder
}: {
  onAddressSelect?: (address: string) => void;
    placeholder?: string;
}) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { componentRestrictions: { country: 'es' } },
    debounce: 300,
    cache: 86400,
  });

  const renderSuggestions = () => {
    return data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
        description,
      } = suggestion;

      return (
        <li
          key={place_id}
          onClick={() => {
            setValue(description, false);
            clearSuggestions();
            onAddressSelect && onAddressSelect(description);
          }}
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });
  };

  return (
    <div>
      <input
        value={value}
        disabled={!ready}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />

      {status === 'OK' && <ul>{renderSuggestions()}</ul>}
    </div>
  );
}
