import RequestCardSkeleton from '@/components/skeletons/RequestCard';
import NEXT_ROUTES from '@/constants/nextRoutes';
import useUser from '@/hooks/useUser';
import TripRequestI from '@/interfaces/tripRequest';
import { shortenName } from '@/utils/formatters';
import TripCard from '../recommendation';
import usePassenger from '@/hooks/usePassenger';

type Props = {
  request: TripRequestI;
  className?: string;
};

export default function RequestCard({ request, className = '' }: Props) {
  const { passenger, isLoading, isError } = usePassenger(request.passenger);
  // NOTE: this works now because passengers and drivers have the same ID.
  // If we were to use different IDs for them (for example UUIDs), we would
  // need to use a different hook here.

  const { user } = useUser(passenger?.user);

  if (!user || isLoading || isError) {
    return <RequestCardSkeleton />;
  }

  return (
    <div className={'flex w-full flex-col bg-white ' + className}>
      <p className="z-10 mb-2 w-full rounded-t-lg bg-turquoise px-4 py-2 text-xl text-white outline outline-1 outline-turquoise">
        Solicitud de viaje
      </p>
      <TripCard
        className="-my-2 rounded-b-lg outline outline-1 outline-light-gray"
        type="passenger"
        name={shortenName(user?.first_name, user?.last_name)}
        rating={0.0}
        origin={request.trip.driver_routine.origin.address}
        destination={request.trip.driver_routine.destination.address}
        price={Number.parseFloat(request.trip.driver_routine.price)}
        note={request.note}
        date={request.trip.departure_datetime}
        avatar={user?.photo}
        href={NEXT_ROUTES.ACCEPT_TRIP_REQUEST(request.id)}
      />
    </div>
  );
}
