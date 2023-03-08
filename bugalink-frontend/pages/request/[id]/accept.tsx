import { BackButtonText } from '../../../components/buttons/Back';
import CTAButton from '../../../components/buttons/CTA';
import AnimatedLayout from '../../../components/layouts/animated';
import ProfileHeader from '../../../components/ProfileHeader';
import TripDetails from '../../../components/TripDetails';

export default function AcceptRequest() {
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
        <div className="py-2 mt-36">
          <p className="font-lato font-bold text-xl">Detalles del viaje</p>
        </div>
        <TripDetails />
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
