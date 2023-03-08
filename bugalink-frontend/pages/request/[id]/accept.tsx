import { BackButtonText } from '../../../components/buttons/Back';
import SourcePin from '/public/assets/source-pin.svg';
import TargetPin from '/public/assets/map-mark.svg';
import Dots from '/public/assets/dots.svg';
import CTAButton from '../../../components/buttons/CTA';
import AnimatedLayout from '../../../components/layouts/animated';
import PlusMinusCounter from '../../../components/buttons/PlusMinusCounter';
import { useState } from 'react';
import ProfileHeader from '../../../components/ProfileHeader';

export default function AcceptRequest() {
  const [reservedSeats, setReservedSeats] = useState(1);

  return (
    <AnimatedLayout className="flex flex-col justify-between">
      <BackButtonText text="Solicitud de viaje" />
      <div className="flex flex-col px-4 pb-4 pt-2 h-full overflow-y-scroll bg-white">
        {/* Profile header */}
        <ProfileHeader />
        <div className="flex flex-row mt-4">
          <p className="text-sm font-normal text-dark-grey text-justify">
            Nota del pasajero
          </p>
        </div>
        <div className="flex flex-row">
          <p className="font-bold text-justify">
            ✏️ Algunos días sueltos no haré el viaje, pero los cancelaré con un
            par de días de antelación para dejar el asiento libre a otros
            usuarios de la aplicación.
          </p>
        </div>
        {/* Details */}
        <div className="py-2 mt-44">
          <p className="font-lato font-bold text-xl">Detalles del viaje</p>
        </div>
        <div className="py-2">
          <p className="text-xs">
            Cada viernes a partir del 16 de febrero de 2023
          </p>
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
      </div>
      {/* Trip request */}
      <div className="flex flex-col w-full items-center justify-between py-6 bg-white rounded-t-lg shadow-t-md px-4 z-50">
        <div className="flex flex-row pb-3">
          <p className="text-md font-medium text-red-dark">
            No puedo llevar a este pasajero
          </p>
        </div>
        <CTAButton className="w-4/5" text={'ACEPTAR'} />
      </div>
    </AnimatedLayout>
  );
}
