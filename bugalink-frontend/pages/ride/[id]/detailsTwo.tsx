import { useState } from 'react';
import { BackButtonText } from '../../../components/buttons/Back';
import CTAButton from '../../../components/buttons/CTA';
import PlusMinusCounter from '../../../components/buttons/PlusMinusCounter';
import AnimatedLayout from '../../../components/layouts/animated';
import MapPreview from '../../../components/MapPreview';
import ProfileHeader from '../../../components/ProfileHeader';
import TripDetails from '../../../components/TripDetails';

const MIN_RESERVED_SEATS = 1;
const MAX_RESERVED_SEATS = 8; // TODO: Get max free seats the driver offers from the backend

export default function DetailsTwo() {
  const [reservedSeats, setReservedSeats] = useState(1);

  return (
    <AnimatedLayout className="flex flex-col justify-between">
      <BackButtonText text="Detalles del viaje" />
      <div className="flex h-full flex-col overflow-y-scroll bg-white px-4 pb-4 pt-2">
        {/* Map preview */}
        <MapPreview />
        {/* Details */}
        <TripDetails
          date="Viernes 16 de febrero de 2023"
          originHour="21:00"
          destinationHour="21:15"
          origin="Escuela Técnica Superior de Ingeniería Informática (ETSII), 41002
          Sevilla"
          destination="Avenida de Andalucía, 35, Dos Hermanas, 41002 Sevilla"
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
        />
        <div className="flex flex-row">
          <p className="font-normal text-dark-turquoise">
            Añade una nota al conductor
          </p>
        </div>
      </div>
      {/* Trip request */}
      <div className="z-50 flex w-full flex-row items-center justify-between rounded-t-lg bg-white py-6 px-4 shadow-t-md">
        <div className="flex flex-col">
          <p className="text-md font-normal">Precio total</p>
          <p className="text-3xl font-bold">4,00€</p>
        </div>
        <CTAButton className="w-2/3" text={'SOLICITAR'} />
      </div>
    </AnimatedLayout>
  );
}
