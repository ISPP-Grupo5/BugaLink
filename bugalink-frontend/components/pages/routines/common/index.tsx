import { BackButton } from '@/components/buttons/Back';
import CTAButton from '@/components/buttons/CTA';
import PlusMinusCounter from '@/components/buttons/PlusMinusCounter';
import TextAreaField from '@/components/forms/TextAreaField';
import TimePicker from '@/components/forms/TimePicker';
import AnimatedLayout from '@/components/layouts/animated';
import PlacesAutocomplete from '@/components/maps/placesAutocomplete';
import { useLoadScript } from '@react-google-maps/api';
import dynamic from 'next/dynamic';
import { useMemo, useRef, useState } from 'react';
import { getGeocode, getLatLng } from 'use-places-autocomplete';
import TextField from '@/components/forms/TextField';
import { axiosAuth } from '@/lib/axios';

const MIN_FREE_SEATS = 1;
const MAX_FREE_SEATS = 8;

const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const daysToApi = ['Mon', 'tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type Props = {
  userType: 'passenger' | 'driver';
  freeSeatsNumber?: number;
  setFreeSeatsNumber?: (freeSeats: number) => void;
};

export const LeafletMap = dynamic(() => import('@/components/maps/map'), {
  ssr: false,
});

export const EmptyLeafletMap = dynamic(
  () => import('@/components/maps/emptyMap'),
  { ssr: false }
);

interface FormErrors {
  price?: string;
}

interface FormValues {
  price: number;
}

export default function NewRoutine({
  userType,
  freeSeatsNumber,
  setFreeSeatsNumber,
}: Props) {
  const [pickTimeFrom, setPickTimeFrom] = useState('12:00');
  const [pickTimeTo, setPickTimeTo] = useState('12:10');
  const [time, setTime] = useState<number>(0);
  const [selectedDays, setSeletedDays] = useState([]);
  const arrivalTime = new Date(Date.now());
  arrivalTime.setHours(Number(pickTimeFrom?.split(':')[0]));
  arrivalTime.setMinutes(Number(pickTimeFrom?.split(':')[1]) + time);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const [originCoords, setOriginCoords] = useState(undefined);
  const [destinationCoords, setDestinationCoords] = useState(undefined);
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  //arrivalTime.setMinutes
  const validateForm = (values: FormValues) => {
    const errors: FormErrors = {};
    let isValid = true;

    if (values.price < 0) {
      errors.price = 'El precio no debe ser un valor negativo';
      isValid = false;
    } else if (!values.price) {
      errors.price = 'Por favor, ingrese un precio';
      isValid = false;
    } else if (values.price > totalDistance * 0.1 * 2) {
      errors.price =
        'El precio no puede ser mayor que el doble del precio recomendado';
      isValid = false;
    }

    setErrors(errors);

    return errors;
  };

  const libraries = useMemo(() => ['places'], []);
  const [note, setNote] = useState('');

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (formRef.current) {

      const formData = new FormData(formRef.current);
      const values: FormValues = {
        price: formData.get('price') as unknown as number,
      };
      const errors = validateForm(values);
      setErrors(errors);
      if (Object.keys(errors).length === 0) {
        // Aquí puedes hacer la llamada a la API o enviar los datos a donde los necesites
        let daysOfWeek = [];
        for (const day in selectedDays) {
          daysOfWeek.push();
        }
        const data = {
          "origin": {
            "address": origin,
            "latitude": originCoords.lat.toString(),
            "longitude": originCoords.lng.toString()
          },
          "destination": {
            "address": destination,
            "latitude": destinationCoords.lat.toString(),
            "longitude": destinationCoords.lng.toString()
          },
          "day_of_week": "Mon",
          "departure_time_start": pickTimeFrom,
          "departure_time_end": pickTimeTo,
          "arrival_time": "" + arrivalTime.getHours() + ":" + arrivalTime.getMinutes(),
          "price": price,
          "note": note,
          "is_recurrent": false,
          "available_seats": freeSeatsNumber
        };
        console.log(data);
        axiosAuth.post('driver-routines/', data)
          .then(response => {
            console.log('Data:', response.data);
          })
          .catch(error => {
            console.error('Error:', error);
          });

        console.log(
          'Los datos del formulario son válidos. ¡Enviando formulario!'
        );
      }
    }
  };

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
              setTotalDistance={setTotalDistance}
              setTime={setTime}
            />
          ) : (
            <EmptyLeafletMap />
          )}
        </div>
        <form
          ref={formRef}
          className="flex w-full flex-none flex-col rounded-t-3xl bg-white px-10 pb-4 pt-8"
        >
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
            {days.map((day: string) => (
              <p
                key={day}
                className={`h-full w-full py-2 transition-colors duration-300 ${selectedDays.includes(day) ? 'bg-turquoise text-white' : ''
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

              <div className="mt-2 flex flex-row place-content-center items-center space-x-4">
                <input type="checkbox" className="h-5 w-5" />
                <label className="text-xl font-bold">No repetir el viaje</label>
              </div>
              <label className="mt-4 text-xl font-bold">
                Establece un precio por pasajero
              </label>
              <p>
                El precio recomendado para este trayecto (0.10€/km) es de{' '}
                {Math.round((totalDistance * 0.1 + Number.EPSILON) * 1000) /
                  1000}
                €
              </p>
              <div className="my-3 mt-4 flex flex-col">
                <TextField
                  type={'number'}
                  content={price}
                  name="price"
                  fieldName={'Introduce un precio'}
                  inputClassName="w-full"
                  setContent={setPrice}
                  error={errors.price}
                  parentClassName="w-full flex flex-col items-center"
                />
              </div>

              <label className="mt-4 mb-2 text-xl font-bold">
                ¿Quieres dejar alguna nota a tus pasajeros?
              </label>
              <div className="my-2 flex flex-col">
                <TextAreaField
                  fieldName="¿Qué le quieres decir al pasajero?"
                  content={note}
                  setContent={setNote}
                  inputClassName="w-full"
                  rows={8}
                />
              </div>
            </div>
          )}
          <CTAButton
            className="mt-4 w-full"
            text="CREAR"
            onClick={handleButtonClick}
          />
        </form>
      </div>
    </AnimatedLayout>
  );
}
