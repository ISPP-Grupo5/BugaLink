import PlacesAutocomplete from '@/components/maps/placesAutocomplete';
import { LatLng, getGeocode, getLatLng } from 'use-places-autocomplete';
import MagnifyingGlass from '/public/icons/Vista-Principal/glass.svg';
import Destino from 'public/icons/Vista-Principal/destino.svg';
import { useMemo, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { useRouter } from 'next/router';
import usePosition from '@/hooks/usePosition';

export default function SearchBar() {
  const [destinationAddress, setDestinationAddress] = useState('');
  const [destinationCoords, setDestinationCoords] = useState<LatLng>();
  const router = useRouter();
  const { position } = usePosition();

  // Initializing google maps API
  const libraries = useMemo(() => ['places'], []);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: libraries as any,
  });

  if (!isLoaded) return <></>;
  return (
    <div className="flex w-full items-center rounded-full bg-white py-3 px-4">
      <Destino className="h-5 w-5 flex-none translate-y-0.5 scale-125 fill-light-turquoise stroke-light-turquoise" />
      <PlacesAutocomplete
        onAddressSelect={(address) => {
          // delete errors.origin;
          getGeocode({ address: address }).then((results) => {
            setDestinationAddress(results[0].formatted_address);
            setDestinationCoords(getLatLng(results[0]));
          });
        }}
        className=" -my-1 w-full bg-white focus:outline-none"
        placeholder="Dónde quieres ir?"
        defaultValue={destinationAddress}
        isSearch
      />
      <button
        type="submit"
        data-cy="search-btn"
        onClick={() => {
          router.push({
            pathname: '/search',
            query: {
              origin: `${position?.lat},${position?.lng}`,
              originAddress: 'Mi ubicación',
              destination: `${destinationCoords.lat},${destinationCoords.lng}`,
              destinationAddress: destinationAddress,
            },
          });
        }}
      >
        <MagnifyingGlass />
      </button>
    </div>
  );
}
