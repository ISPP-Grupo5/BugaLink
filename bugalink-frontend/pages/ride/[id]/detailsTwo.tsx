import Link from 'next/link';
import { BackButtonText } from '../../../components/buttons/Back';
import SourcePin from '/public/assets/source-pin.svg';
import TargetPin from '/public/assets/map-mark.svg';
import Dots from '/public/assets/dots.svg';
import CTAButton from '../../../components/buttons/CTA';
import AnimatedLayout from '../../../components/layouts/animated';
import PlusMinusCounter from '../../../components/buttons/PlusMinusCounter';
import { useState } from 'react';
import ProfileHeader from '../../../components/ProfileHeader';

const MIN_RESERVED_SEATS = 1;
const MAX_RESERVED_SEATS = 8; // TODO: Get max free seats the driver offers from the backend

export default function DetailsTwo() {
  const [reservedSeats, setReservedSeats] = useState(1);

  return (
    <AnimatedLayout className="flex flex-col justify-between">
      <BackButtonText text="Detalles del viaje" />
      <div className="flex flex-col px-4 pb-4 pt-2 h-full overflow-y-scroll bg-white">
        {/* Map preview */}
        <Link href="/ride/V1StGXR8_Z5jdHi6B-myT/map">
          <img
            src="/assets/mocks/map.png"
            className="w-full max-h-44 flex object-cover rounded-lg"
          />
        </Link>
        {/* Details */}
        <div className="py-2">
          <p className="text-xs">Viernes 16 de febrero de 2023</p>
        </div>
        <div className="grid justify-items-center items-center grid-cols-8 grid-rows-5 mt-2 text-sm">
          <span className="font-bold self-start justify-self-end row-span-2">
            21:00
          </span>
          <div className=" h-full w-full flex flex-col items-center justify-between pt-1 pb-6 row-span-5">
            <SourcePin />
            <Dots className="h-10" />
            <TargetPin />
          </div>
          <span className="col-span-6 row-span-2">
            Escuela Técnica Superior de Ingeniería Informática (ETSII), 41002
            Sevilla
          </span>

          <hr className="col-span-6 w-full text-border-color" />

          <span className="font-bold self-start justify-self-end row-span-2">
            21:15
          </span>

          <span className="col-span-6 row-span-2">
            Avenida de Andalucía, 35, Dos Hermanas, 41002 Sevilla
          </span>
        </div>
        <hr className="mt-3 mb-3 w-full text-border-color" />

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
        <ProfileHeader />
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
