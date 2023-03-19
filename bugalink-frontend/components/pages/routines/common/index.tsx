import MapPreview from '@/components/maps/mapPreview';
import PlacesAutocomplete from '@/components/maps/placesAutocomplete';
import { useLoadScript } from '@react-google-maps/api';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getGeocode, getLatLng } from 'use-places-autocomplete';
import { BackButton } from '../../../buttons/Back';
import CTAButton from '../../../buttons/CTA';
import PlusMinusCounter from '../../../buttons/PlusMinusCounter';
import TextField from '../../../forms/TextField';
import TimePicker from '../../../forms/TimePicker';

const MIN_FREE_SEATS = 1;
const MAX_FREE_SEATS = 8;

const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

type Props = {
  userType: 'passenger' | 'driver';
  freeSeatsNumber?: number;
  setFreeSeatsNumber?: (freeSeats: number) => void;
};

export const LeafletMap = dynamic(
  () => import('../../../../components/maps/map'),
  { ssr: false }
);

export const EmptyLeafletMap = dynamic(
  () => import('../../../../components/maps/emptyMap'),
  { ssr: false }
);

export default function NewRoutine({
  userType,
  freeSeatsNumber,
  setFreeSeatsNumber,
}: Props) {
  const [originAddress, setOriginAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [pickTimeFrom, setPickTimeFrom] = useState('12:00');
  const [pickTimeTo, setPickTimeTo] = useState('12:10');
  const [selectedDays, setSeletedDays] = useState([]);

  const [resultSource, setResultSource] = useState<[number, number] | null>(
    null
  );
  const [resultDestination, setResultDestination] = useState<
    [number, number] | null
  >(null);

  const generateMap = () => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${originAddress}&key=AIzaSyD9tGiM0f6M9NDjoLCG853316Iv8UrdeAs`
    )
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        setResultSource([
          jsonData.results[0].geometry.location.lat,
          jsonData.results[0].geometry.location.lng,
        ]);
      })
      .catch((error) => {
        console.log(error);
      });

    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${destinationAddress}&key=AIzaSyD9tGiM0f6M9NDjoLCG853316Iv8UrdeAs`
    )
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        setResultDestination([
          jsonData.results[0].geometry.location.lat,
          jsonData.results[0].geometry.location.lng,
        ]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const libraries = useMemo(() => ['places'], []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyD9tGiM0f6M9NDjoLCG853316Iv8UrdeAs',
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div className="h-screen">
      <BackButton />
      {resultDestination && resultSource && (
        <div className="h-2/6 w-full">
          <LeafletMap source={resultSource} destination={resultDestination} />
        </div>
      )}
      {(!resultDestination || !resultSource) && (
        <div className="h-2/6 w-full">
          <EmptyLeafletMap />
        </div>
      )}
      <form className="absolute bottom-0 z-10 flex w-full flex-col rounded-t-3xl bg-white px-10 pb-4 pt-8">
        <PlacesAutocomplete
          onAddressSelect={(address) => {
            getGeocode({ address: address }).then((results) => {
              const { lat, lng } = getLatLng(results[0]);
              setResultSource([lat, lng]);
            });
          }}
          placeholder="Desde"
        />

        <PlacesAutocomplete
          onAddressSelect={(address) => {
            getGeocode({ address: address }).then((results) => {
              const { lat, lng } = getLatLng(results[0]);
              setResultDestination([lat, lng]);
            });
          }}
          placeholder="Hasta"
        />

        <TextField
          type={'text'}
          fieldName={'Desde'}
          content={originAddress}
          setContent={setOriginAddress}
          parentClassName="mb-6"
          inputClassName="w-full"
        />
        <TextField
          type={'text'}
          fieldName={'Hasta'}
          content={destinationAddress}
          setContent={setDestinationAddress}
          parentClassName="mb-8"
          inputClassName="w-full"
        />
        <div onClick={generateMap}>Ver en mapa</div>
        <div className="mb-4 flex flex-col">
          <label className="text-xl font-bold">
            {userType === 'passenger' ? 'Hora de recogida' : 'Hora de salida'}
          </label>
          <span className="mt-2 flex items-center space-x-2 text-xl">
            <p>Entre las</p>{' '}
            <TimePicker time={pickTimeFrom} setTime={setPickTimeFrom} />
            <p>y las</p>{' '}
            <TimePicker time={pickTimeTo} setTime={setPickTimeTo} />
          </span>
        </div>

        <label className="text-xl font-bold">Días de la semana</label>
        <span className="mt-2 grid grid-cols-7 items-center divide-x divide-light-gray overflow-hidden rounded-xl border border-light-gray bg-white text-center text-xl">
          {days.map((day) => (
            <p
              key={day}
              className={`h-full w-full py-2 transition-colors duration-300 ${
                selectedDays.includes(day) ? 'bg-turquoise text-white' : ''
              }`}
              onClick={() => {
                if (selectedDays.includes(day)) {
                  setSeletedDays(selectedDays.filter((d) => d !== day));
                } else {
                  setSeletedDays([...selectedDays, day]);
                }
              }}
            >
              {day}
            </p>
          ))}
        </span>
        {userType === 'driver' && (
          <div className="mt-4 flex w-full flex-col justify-center">
            <p className="mb-2 text-xl font-bold">¿Cuántos asientos ofreces?</p>
            <PlusMinusCounter
              text={freeSeatsNumber.toString()}
              onMinusClick={() =>
                setFreeSeatsNumber(
                  Math.max(MIN_FREE_SEATS, freeSeatsNumber - 1)
                )
              }
              onPlusClick={() =>
                setFreeSeatsNumber(
                  Math.min(MAX_FREE_SEATS, freeSeatsNumber + 1)
                )
              }
            />
          </div>
        )}
        <CTAButton className="mt-6 w-full" text="CREAR" />
      </form>
    </div>
  );
}
