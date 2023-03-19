import usePlacesAutocomplete from 'use-places-autocomplete';
import TextField from '../forms/TextField';

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
    <div className='mb-6'>
      <TextField
          type={'text'}
          fieldName={placeholder}
          content={value}
          setContent={setValue}
          inputClassName="w-full"
          disabled={!ready}
        />

      {status === 'OK' && <ul className='absolute bg-white z-10 w-full'>{renderSuggestions()}</ul>}
    </div>
  );
}
