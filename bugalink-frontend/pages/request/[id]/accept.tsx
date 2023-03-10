import { BackButtonText } from '../../../components/buttons/Back';
import CTAButton from '../../../components/buttons/CTA';
import AnimatedLayout from '../../../components/layouts/animated';
import MapPreview from '../../../components/MapPreview';
import ProfileHeader from '../../../components/ProfileHeader';
import TripDetails from '../../../components/TripDetails';

export default function AcceptRequest() {
  return (
    <AnimatedLayout className="flex flex-col justify-between">
      <BackButtonText text="Solicitud de viaje" />
      <div className="flex flex-col pb-4 pt-2 px-6 h-full overflow-y-scroll justify-between bg-white">
        {/* Profile header */}
        <ProfileHeader
          name="Jesús Marchena"
          rating="4.8"
          numberOfRatings="14"
        />
        <div className="flex flex-row">
          <p className="text-sm font-normal text-dark-grey text-justify">
            Nota del pasajero
          </p>
        </div>
        <div className="flex flex-row">
          <p className="text-justify leading-5">
            ✏️ Algunos días sueltos no haré el viaje, pero los cancelaré con un
            par de días de antelación para dejar el asiento libre a otros
            usuarios de la aplicación.
          </p>
        </div>

        {/* Details */}
        <div className="py-2 mt-4">
          <hr className="mt-3 mb-3 w-full text-border-color" />
          <p className="font-bold text-xl">Detalles del viaje</p>
        </div>
        {/* Map preview */}
        <MapPreview />
        <TripDetails
          date="Cada viernes a partir del 16 de febrero de 2023"
          originHour="21:00"
          destinationHour="21:15"
          origin="Escuela Técnica Superior de Ingeniería Informática (ETSII), 41002
          Sevilla"
          destination="Avenida de Andalucía, 35, Dos Hermanas, 41002 Sevilla"
        />
      </div>
      {/* Trip request */}
      <div className="flex flex-col w-full items-center justify-between py-6 bg-white rounded-t-lg px-4 z-50">
        <div className="flex flex-row pb-3">
          <p className="text-md font-medium text-red-dark">
            No puedo llevar a este pasajero
          </p>
        </div>
        <CTAButton className="w-11/12" text={'ACEPTAR'} />
      </div>
    </AnimatedLayout>
  );
}
