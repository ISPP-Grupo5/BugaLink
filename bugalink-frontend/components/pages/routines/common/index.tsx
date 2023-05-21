import { BackButton } from '@/components/buttons/Back';
import CTAButton from '@/components/buttons/CTA';
import PlusMinusCounter from '@/components/buttons/PlusMinusCounter';
import DialogComponent from '@/components/dialog';
import TextAreaField from '@/components/forms/TextAreaField';
import TextField from '@/components/forms/TextField';
import TimePicker from '@/components/forms/TimePicker';
import AnimatedLayout from '@/components/layouts/animated';
import PlacesAutocomplete from '@/components/maps/placesAutocomplete';
import NEXT_ROUTES from '@/constants/nextRoutes';
import useDriver from '@/hooks/useDriver';
import usePassenger from '@/hooks/usePassenger';
import DriverRoutineI from '@/interfaces/driverRoutine';
import GenericRoutineI from '@/interfaces/genericRoutine';
import PassengerRoutineI from '@/interfaces/passengerRoutine';
import { axiosAuth } from '@/lib/axios';
import { parseDate } from '@/utils/formatters';
import { useLoadScript } from '@react-google-maps/api';
import { all } from 'cypress/types/bluebird';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getGeocode, getLatLng } from 'use-places-autocomplete';

const MIN_FREE_SEATS = 1;
const MAX_FREE_SEATS = 8;

const DAYS_TO_SPANISH = {
  Mon: 'L',
  Tue: 'M',
  Wed: 'X',
  Thu: 'J',
  Fri: 'V',
  Sat: 'S',
  Sun: 'D',
};

const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const daysToApi = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type Props = {
  userType: 'passenger' | 'driver';
  freeSeatsNumber?: number;
  setFreeSeatsNumber?: (freeSeats: number) => void;
  routineDetailsDriver?: DriverRoutineI;
  routineDetailsPassenger?: PassengerRoutineI;
};

export const LeafletMap = dynamic(() => import('@/components/maps/map'), {
  ssr: false,
});

export const EmptyLeafletMap = dynamic(
  () => import('@/components/maps/emptyMap'),
  { ssr: false }
);

const mergeRoutines = (
  passengerRoutines: PassengerRoutineI[],
  driverRoutines: DriverRoutineI[]
): GenericRoutineI[] => {
  const allRoutines = [];
  for (const routine of [...passengerRoutines, ...driverRoutines]) {
    // We add a card for each day of the week the routine is repeated
    allRoutines.push({
      id: routine.id,
      origin: routine.origin,
      destination: routine.destination,
      day_of_week: routine.day_of_week,
      departure_time_start: parseDate(routine.departure_time_start), // 18:00:00 -> 18:00
      departure_time_end: parseDate(routine.departure_time_end), // 18:00:00 -> 18:00
      type: routine.type,
    });
  }
  return allRoutines;
};

interface FormErrors {
  origin?: string;
  destination?: string;
  pickTimeFrom?: string;
  pickTimeTo?: string;
  selectedDays?: string;
  price?: string;
}

interface FormValues {
  origin: string;
  destination: string;
  pickTimeFrom: string;
  pickTimeTo: string;
  price: number;
}

export default function NewRoutine({
  userType,
  freeSeatsNumber,
  setFreeSeatsNumber,
  routineDetailsDriver,
  routineDetailsPassenger,
}: Props) {
  const [pickTimeFrom, setPickTimeFrom] = useState('12:00');
  const [pickTimeTo, setPickTimeTo] = useState('12:10');
  const [time, setTime] = useState<number>(0);
  const [selectedDays, setSelectedDays] = useState([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [repeatTrip, setRepeatTrip] = useState(false);

  const [originCoords, setOriginCoords] = useState(undefined);
  const [destinationCoords, setDestinationCoords] = useState(undefined);
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const [price, setPrice] = useState(
    routineDetailsDriver ? routineDetailsDriver.price : ''
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const [isSendingForm, setIsSendingForm] = useState(false);

  const { data } = useSession();
  const user = data?.user as User;
  const {
    passenger,
    isLoading: passengerIsLoading,
    isError: passengerIsError,
  } = usePassenger(user?.passenger_id);
  const {
    driver,
    isLoading: driverIsLoading,
    isError: driverIsError,
  } = useDriver(user?.driver_id);

  const passengerRoutines = passenger?.routines || [];
  const driverRoutines = driver?.routines || [];
  const allRoutines = mergeRoutines(passengerRoutines, driverRoutines);

  const addZero = (i: any) => {
    if (i < 10) {i = "0" + i}
    return i;
  }

  const timeInRange = (time: string, startDate: string, endDate: string) => {
    const timeArray = time.split(':');
    const hours = parseInt(timeArray[0]);
    const minutes = parseInt(timeArray[1]);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setFullYear(2000, 1, 1);

    const dateStart = new Date(startDate);
    dateStart.setFullYear(2000, 1, 1);

    const dateEnd = new Date(endDate);
    dateEnd.setFullYear(2000, 1, 1);

    return date >= dateStart && date <= dateEnd;
  }

  const validateRoutineForm = (values: FormValues) => {
    const errors: FormErrors = {};
    selectedDays.forEach((day) => {
      const existingRoutine = allRoutines.find(
        (routine) =>
          routine.day_of_week === day &&
          (timeInRange(values.pickTimeFrom, routine.departure_time_start, routine.departure_time_end) ||
          timeInRange(values.pickTimeTo, routine.departure_time_start, routine.departure_time_end))
      );

      if (existingRoutine) {
        errors.selectedDays = `Ya existe una rutina para esta hora y día: ${days[daysToApi.indexOf(day)]}`;
        errors.pickTimeFrom = 'Ya existe una rutina para esta hora y día';
        errors.pickTimeTo = 'Ya existe una rutina para esta hora y día';
      }
    });
    setErrors(errors)
    return errors;
  };
  
  const isEdit = routineDetailsDriver || routineDetailsPassenger;

  const [openDialog, setOpenDialog] = useState(false);

  const onCloseDialog = () => {
    setOpenDialog(false);

    router.push(NEXT_ROUTES.MY_ROUTINES);
  };

  //arrivalTime.setMinutes
  const validateForm = (values: FormValues) => {
    const errors: FormErrors = {};

    if (!values.origin) {
      errors.origin = 'Por favor, ingresa una dirección de origen';
    }

    if (!values.destination) {
      errors.destination = 'Por favor, ingresa una dirección de destino';
    }

    if (values.origin && values.destination) {
      if (values.origin === values.destination) {
        errors.origin = 'El origen y el destino no pueden ser iguales';
      }
    }

    if (!values.pickTimeFrom) {
      errors.pickTimeFrom = 'Por favor, ingresa una hora de inicio';
    }

    if (!values.pickTimeTo) {
      errors.pickTimeTo = 'Por favor, ingresa una hora de fin';
    }

    if (values.pickTimeFrom && values.pickTimeTo) {
      const pickTimeFromHour = parseInt(values.pickTimeFrom.split(':')[0]);
      const pickTimeFromMinutes = parseInt(values.pickTimeFrom.split(':')[1]);
      const pickTimeToHour = parseInt(values.pickTimeTo.split(':')[0]);
      const pickTimeToMinutes = parseInt(values.pickTimeTo.split(':')[1]);

      if (
        pickTimeFromHour > pickTimeToHour ||
        (pickTimeFromHour === pickTimeToHour &&
          pickTimeFromMinutes > pickTimeToMinutes)
      ) {
        errors.pickTimeTo =
          'La hora de fin debe ser posterior a la hora de inicio';
      }

      const pickTimeFromDate = new Date();
      pickTimeFromDate.setHours(pickTimeFromHour);
      pickTimeFromDate.setMinutes(pickTimeFromMinutes);

      const pickTimeToDate = new Date();
      pickTimeToDate.setHours(pickTimeToHour);
      pickTimeToDate.setMinutes(pickTimeToMinutes);

      const differenceMs = pickTimeToDate.getTime() - pickTimeFromDate.getTime();

      if (differenceMs > 900000) {
        errors.pickTimeTo =
          'El rango de tiempo no puede ser mayor a 15 minutos';
      }

    }

    if (!selectedDays || selectedDays.length === 0) {
      errors.selectedDays = 'Por favor, seleccione al menos un día';
    }

    if (userType === 'driver') {
      if (values.price < 0) {
        errors.price = 'El precio no debe ser un valor negativo';
      } else if (!values.price) {
        errors.price = 'Por favor, ingrese un precio';
      } else if (!/^\d+(\.\d{1,2})?$/.test(values.price.toString())) {
        errors.price = 'El precio debe tener máximo dos cifras decimales';
      } else if (
        totalDistance * 0.1 > 0.0 &&
        (values.price > totalDistance * 0.1 * 2 ||
          values.price < (totalDistance * 0.1) / 2)
      ) {
        errors.price =
          'El precio debe situarse entre la mitad y el doble del precio recomendado';
      } else if (
        totalDistance * 0.1 == 0.0 &&
        (values.price < 0.3 || values.price > 0.8)
      ) {
        errors.price =
          'Para una distancia tan corta se debe establecer un precio de entre 30 y 80 céntimos';
      }
    }

    setErrors(errors);

    return errors;
  };

  const libraries = useMemo(() => ['places'], []);
  const [note, setNote] = useState(
    routineDetailsDriver ? routineDetailsDriver.note : ''
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: libraries as any,
  });

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsSendingForm(true);
    event.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const values: FormValues = {
        origin: formData.get('origin') as string,
        destination: formData.get('destination') as string,
        pickTimeFrom: formData.get('pickTimeFrom') as string,
        pickTimeTo: formData.get('pickTimeTo') as string,
        price: formData.get('price') as unknown as number,
      };
      const duplicatedRoutineErrors = validateRoutineForm(values);
      const errorsForm = validateForm(values);
      const errors = Object.assign({}, errorsForm, duplicatedRoutineErrors);
      setErrors(errors);
      if (Object.keys(errors).length === 0) {
        // Aquí puedes hacer la llamada a la API o enviar los datos a donde los necesites
        const arrivalTime = new Date(Date.now());
        arrivalTime.setHours(Number(pickTimeFrom?.split(':')[0]));
        arrivalTime.setMinutes(Number(pickTimeFrom?.split(':')[1]) + time);

        const data = {
          origin: {
            address: origin,
            latitude: originCoords.lat.toString(),
            longitude: originCoords.lng.toString(),
          },
          destination: {
            address: destination,
            latitude: destinationCoords.lat.toString(),
            longitude: destinationCoords.lng.toString(),
          },
          days_of_week: selectedDays,
          departure_time_start: pickTimeFrom,
          departure_time_end: pickTimeTo,
          arrival_time:
            '' + arrivalTime.getHours() + ':' + arrivalTime.getMinutes(),
          price: price,
          note: note,
          is_recurrent: repeatTrip,
          available_seats: freeSeatsNumber,
        };

        if (isEdit) {
          const url =
            userType === 'driver'
              ? `driver-routines/${routineDetailsDriver.id}/update/`
              : `passenger-routines/${routineDetailsPassenger.id}/update/`;
          axiosAuth
            .put(url, data)
            .then((response) => {
              setOpenDialog(true);
            })
            .catch((error) => {
              setIsSendingForm(false);
            });
        } else {
          const url =
            userType === 'driver' ? 'driver-routines/' : 'passenger-routines/';
          axiosAuth
            .post(url, data)
            .then((response) => {
              setOpenDialog(true);
            })
            .catch((error) => {
              setIsSendingForm(false);
            });
        }
      } else {
        setIsSendingForm(false);
      }
    }
  };

  useEffect(() => {
    if (!routineDetailsDriver && !routineDetailsPassenger) return;
    const routine = (routineDetailsDriver ||
      routineDetailsPassenger) as GenericRoutineI;

    setOrigin(routine.origin.address);
    setDestination(routine.destination.address);
    setOriginCoords({
      lat: routine.origin.latitude,
      lng: routine.origin.longitude,
    });
    setDestinationCoords({
      lat: routine.destination.latitude,
      lng: routine.destination.longitude,
    });
    setPickTimeFrom(
      routine.departure_time_start.length > 5
        ? routine.departure_time_start.substring(0, 5)
        : routine.departure_time_start
    );
    setPickTimeTo(
      routine.departure_time_end.length > 5
        ? routine.departure_time_end.substring(0, 5)
        : routine.departure_time_end
    );
    setSelectedDays([routine.day_of_week]);

    if (routineDetailsDriver) {
      const driverRoutine = routine as DriverRoutineI;

      setPrice(driverRoutine.price);
      setNote(driverRoutine.note);
      setFreeSeatsNumber(driverRoutine.available_seats);
    }
  }, [routineDetailsDriver, routineDetailsPassenger]);

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <AnimatedLayout className="bg-white">
      <BackButton className="absolute left-2 top-2 bg-base-origin py-3 px-2 shadow-xl" />
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
          autoComplete="off"
        >
          <PlacesAutocomplete
            onAddressSelect={(address) => {
              delete errors.origin;
              getGeocode({ address: address }).then((results) => {
                setOrigin(results[0].formatted_address);
                setOriginCoords(getLatLng(results[0]));
              });
            }}
            placeholder="Desde"
            name="origin"
            defaultValue={origin}
            error={errors.origin}
          />

          <PlacesAutocomplete
            onAddressSelect={(address) => {
              delete errors.destination;
              getGeocode({ address: address }).then((results) => {
                setDestination(results[0].formatted_address);
                setDestinationCoords(getLatLng(results[0]));
              });
            }}
            placeholder="Hasta"
            name="destination"
            defaultValue={destination}
            error={errors.destination}
          />
          <div className="mb-4 flex flex-col">
            <label className="text-xl font-bold">
              {userType === 'passenger' ? 'Hora de recogida' : 'Hora de salida'}
            </label>
            <span className="mt-2 flex items-center space-x-2 text-xl">
              <p>Entre las</p>{' '}
              <TimePicker
                time={pickTimeFrom}
                setTime={setPickTimeFrom}
                name="pickTimeFrom"
                error={errors.pickTimeFrom}
              />
              <p>y las</p>{' '}
              <TimePicker
                time={pickTimeTo}
                setTime={setPickTimeTo}
                name="pickTimeTo"
                error={errors.pickTimeTo}
              />
            </span>
            {errors.pickTimeFrom ||
              (errors.pickTimeTo && (
                <div className="-mt-2 text-xs font-medium text-red">
                  {errors.pickTimeFrom} <br /> {errors.pickTimeTo}
                </div>
              ))}
          </div>

          <label className="text-xl font-bold">Días de la semana</label>
          <span
            className={`mt-2 grid min-h-[3rem] grid-cols-7 items-center divide-x overflow-hidden rounded-xl border  bg-white text-center text-xl ${
              errors.selectedDays
                ? 'divide-red border-red text-red'
                : 'divide-light-gray border-light-gray'
            }`}
          >
            {Object.entries(DAYS_TO_SPANISH).map(
              (
                [day, shortDay] // L, M, X...
              ) => (
                <p
                  key={day}
                  data-cy={day}
                  className={`h-full w-full py-2 transition-colors duration-300 ${
                    selectedDays.includes(day) ? 'bg-turquoise text-white' : ''
                  } ${isEdit ? 'grayscale' : ''}
                `}
                  onClick={() => {
                    if (isEdit) return; // Don't allow editing days
                    delete errors.selectedDays;

                    if (selectedDays.includes(day)) {
                      setSelectedDays(selectedDays.filter((d) => d !== day));
                    } else {
                      setSelectedDays([...selectedDays, day]);
                    }
                  }}
                >
                  {shortDay}
                </p>
              )
            )}
          </span>
          {errors.selectedDays && (
            <div className="mt-1 text-xs font-medium text-red">
              {errors.selectedDays}
            </div>
          )}
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
              {!isEdit && (
                <div className="mt-4 flex flex-col items-center justify-center">
                  <div className="mt-2 flex flex-row place-content-center items-center space-x-4">
                    <input
                      type="checkbox"
                      className="h-5 w-5 accent-turquoise"
                      onChange={() => setRepeatTrip(!repeatTrip)}
                    />
                    <label className="text-xl font-bold">¡Hazme rutina!</label>
                  </div>
                  <span>Repite este trayecto cada semana</span>
                </div>
              )}
              <label className="mt-4 text-xl font-bold">
                Establece un precio por pasajero
              </label>
              <p>
                El precio recomendado para este trayecto (0.10€/km) es de:{' '}
                {(totalDistance * 0.1).toFixed(2) != '0.00'
                  ? `${(totalDistance * 0.1).toFixed(2)}€`
                  : 'entre 30 y 80 céntimos'}
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
            text={
              isSendingForm
                ? 'PROCESANDO...'
                : routineDetailsDriver || routineDetailsPassenger
                ? 'Editar'
                : 'CREAR'
            }
            disabled={isSendingForm}
            className="mt-4 w-full"
            onClick={handleButtonClick}
          />
        </form>
      </div>
      <DialogComponent
        title="Acción realizada"
        description="Tu rutina ha sido actualizada o creada con éxito."
        onClose={onCloseDialog}
        onCloseButton="Entendido"
        open={openDialog}
        setOpen={setOpenDialog}
      />
    </AnimatedLayout>
  );
}
