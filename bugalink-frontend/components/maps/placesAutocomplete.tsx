import { useEffect, useState } from 'react';
import usePlacesAutocomplete from 'use-places-autocomplete';
import TextField from '@/components/forms/TextField';

export default function PlacesAutocomplete({
  onAddressSelect,
  placeholder,
  name,
  error,
  defaultValue
}: {
  onAddressSelect?: (address: string) => void;
  placeholder?: string;
  name?: string;
  error?: string;
  defaultValue?: string;
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

  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputClick = () => {
    setShowSuggestions(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      event.target instanceof HTMLElement &&
      !(event.target instanceof HTMLInputElement)
    ) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    if (defaultValue) setValue(defaultValue);
  }, [defaultValue])

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
            setShowSuggestions(false);
          }}
          className="cursor-pointer px-4 py-2 hover:bg-light-gray"
        >
          <strong className="text-turquoise">{main_text}</strong>{' '}
          <small>{secondary_text}</small>
        </li>
      );
    });
  };

  return (
    <div className="mb-6">
      <TextField
        type={'text'}
        fieldName={placeholder}
        content={value || defaultValue}
        setContent={setValue}
        inputClassName="w-full"
        disabled={!ready}
        onClick={handleInputClick}
        parentClassName="mb-1"
        name={name}
        error={error}
      />

      {showSuggestions && status === 'OK' && (
        <ul
          tabIndex={-1}
          className="absolute z-10 mr-9 divide-y divide-light-gray rounded-lg border border-light-gray bg-white"
        >
          {renderSuggestions()}
        </ul>
      )}
    </div>
  );
}
