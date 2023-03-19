import AnimatedLayout from '@/components/layouts/animated';
import PlacesAutocomplete from '@/components/maps/placesAutocomplete';
import useMapCoordinates from '@/hooks/useMapCoordinates';
import { useLoadScript } from '@react-google-maps/api';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { getGeocode, getLatLng } from 'use-places-autocomplete';
import { BackButton } from '../../../buttons/Back';
import CTAButton from '../../../buttons/CTA';
import PlusMinusCounter from '../../../buttons/PlusMinusCounter';
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
  const [pickTimeFrom, setPickTimeFrom] = useState('12:00');
  const [pickTimeTo, setPickTimeTo] = useState('12:10');
  const [selectedDays, setSeletedDays] = useState([]);

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const [originCoords, setOriginCoords] = useState(undefined);
  const [destinationCoords, setDestinationCoords] = useState(undefined);

  const libraries = useMemo(() => ['places'], []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <AnimatedLayout className="bg-white">
      <BackButton className="absolute left-2 top-2 bg-base-origin py-3 pr-2 shadow-xl" />
      <div className="flex h-full flex-col overflow-y-scroll">
        <div className="h-full min-h-[30%]">
          {originCoords && destinationCoords ? (
            <LeafletMap
              key={`${origin},${destination}`}
              originCoords={originCoords}
              destinationCoords={destinationCoords}
            />
          ) : (
            <EmptyLeafletMap />
          )}
        </div>
        <form className="flex w-full flex-none flex-col rounded-t-3xl bg-white px-10 pb-4 pt-8">
          <PlacesAutocomplete
            onAddressSelect={(address) => {
              getGeocode({ address: address }).then((results) => {
                setOrigin(results[0].formatted_address);
                setOriginCoords(getLatLng(results[0]));
              });
            }}
            placeholder="Desde"
          />

          <PlacesAutocomplete
            onAddressSelect={(address) => {
              getGeocode({ address: address }).then((results) => {
                setDestination(results[0].formatted_address);
                setDestinationCoords(getLatLng(results[0]));
              });
            }}
            placeholder="Hasta"
          />
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
          <span className="mt-2 grid min-h-[3rem] grid-cols-7 items-center divide-x divide-light-gray overflow-hidden rounded-xl border border-light-gray bg-white text-center text-xl">
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
              <p className="mb-2 text-xl font-bold">
                ¿Cuántos asientos ofreces?
              </p>
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
    </AnimatedLayout>
  );
}
