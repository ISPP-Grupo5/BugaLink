import Link from 'next/link';
import { BackButtonText } from '../../../components/buttons/Back';
import CTAButton from '../../../components/buttons/CTA';
import AnimatedLayout from '../../../components/layouts/animated';
import PlusMinusCounter from '../../../components/buttons/PlusMinusCounter';
import { useState } from 'react';
import ProfileHeader from '../../../components/ProfileHeader';
import TripDetails from '../../../components/TripDetails';
import MapPreview from '../../../components/MapPreview';

const MIN_RESERVED_SEATS = 1;
const MAX_RESERVED_SEATS = 8; // TODO: Get max free seats the driver offers from the backend

export default function DetailsTwo() {
  const [reservedSeats, setReservedSeats] = useState(1);

  return (
    <AnimatedLayout className="flex flex-col justify-between">
      <BackButtonText text="Detalles del viaje" />
      <div className="flex flex-col px-4 pb-4 pt-2 h-full overflow-y-scroll bg-white">
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
        <div className="grid grid-rows-2 justify-items-center items-center mb-3">
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
          <p className="text-dark-turquoise font-normal">
            Añade una nota al conductor
          </p>
        </div>
      </div>
      {/* Trip request */}
      <div className="flex flex-row w-full items-center justify-between py-6 bg-white rounded-t-lg shadow-t-md px-4 z-50">
        <div className="flex flex-col">
          <p className="text-md font-normal">Precio total</p>
          <p className="text-3xl font-bold">4,00€</p>
        </div>
        <CTAButton className="w-2/3" text={'PAGAR'} />
      </div>
    </AnimatedLayout>
  );
}
