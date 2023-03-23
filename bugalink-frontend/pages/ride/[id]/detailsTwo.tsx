import { BackButtonText } from '@/components/buttons/Back';
import CTAButton from '@/components/buttons/CTA';
import PlusMinusCounter from '@/components/buttons/PlusMinusCounter';
import AnimatedLayout from '@/components/layouts/animated';
import MapPreview from '@/components/maps/mapPreview';
import ProfileHeader from '@/components/ProfileHeader';
import TripDetails from '@/components/TripDetails';
import useMapCoordinates from '@/hooks/useMapCoordinates';
import { useState } from 'react';

const MIN_RESERVED_SEATS = 1;
const MAX_RESERVED_SEATS = 8; // TODO: Get max free seats the driver offers from the backend

export default function DetailsTwo() {
  const origin =
    'Escuela Técnica Superior de Ingeniería Informática, 41002 Sevilla';
  const destination = 'Avenida de Andalucía, 35, Dos Hermanas, 41002 Sevilla';

  const [reservedSeats, setReservedSeats] = useState(1);
  const [time, setTime] = useState<number>(0);
  const originCoords = useMapCoordinates(origin);
  const destinationCoords = useMapCoordinates(destination);

  // salida a las 21:00 y llegada a las 21:00 mas el tiempo de viaje
  const startTime = new Date('2021-05-01T21:00:00');
  const endTime = new Date('2021-05-01T21:00:00');
  endTime.setMinutes(endTime.getMinutes() + time);

  return (
    <AnimatedLayout className="flex flex-col justify-between">
      <BackButtonText text="Detalles del viaje" />
      <div className="flex h-full flex-col overflow-y-scroll bg-white px-4 pb-4">
        {/* Map preview */}
        <MapPreview
          originCoords={originCoords?.coordinates}
          destinationCoords={destinationCoords?.coordinates}
          setTime={setTime}
          className="h-full"
        />
        {/* Details */}
        <TripDetails
          date="Viernes 16 de febrero de 2023"
          originHour={startTime.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          destinationHour={endTime.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          origin={origin}
          destination={destination}
        />

        {/* Seats selector */}
        <div className="mb-3 grid grid-rows-2 items-center justify-items-center">
          <span className="font-semibold">
            ¿Cuántas plazas quieres reservar?
          </span>
          <PlusMinusCounter
            text={reservedSeats.toString()}
            onMinusClick={() =>
              setReservedSeats(Math.max(MIN_RESERVED_SEATS, reservedSeats - 1))
            }
            onPlusClick={() =>
              setReservedSeats(Math.min(MAX_RESERVED_SEATS, reservedSeats + 1))
            }
          />
        </div>
        <div className="grid justify-items-center">
          <hr className="mt-4 mb-4 w-full text-border-color" />
        </div>

        {/* Profile header */}
        <ProfileHeader
          name="Jesús Marchena"
          rating="4.8"
          numberOfRatings="14"
          photo="/assets/avatar.png"
        />
        <div className="flex flex-row">
          <p className="font-normal text-dark-turquoise">
            {/* TODO: make this button work */}
            Añade una nota al conductor
          </p>
        </div>
      </div>
      {/* Trip request */}
      <div className="flex w-full flex-row items-center justify-between rounded-t-lg bg-white py-6 px-4 shadow-t-md">
        <div className="flex flex-col">
          <p className="text-md font-normal">Precio total</p>
          <p className="text-3xl font-bold">4,00€</p>
        </div>
        <CTAButton className="w-2/3" text={'SOLICITAR'} />
      </div>
    </AnimatedLayout>
  );
}
