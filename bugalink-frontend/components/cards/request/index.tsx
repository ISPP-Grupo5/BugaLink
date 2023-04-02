import NEXT_ROUTES from '@/constants/nextRoutes';
import TripRequestI from '@/interfaces/tripRequest';
import { formatDatetime } from '@/utils/formatters';
import TripCard from '../recommendation';

type Props = {
  request: TripRequestI;
  className?: string;
};

export default function RequestCard({ request, className = '' }: Props) {
  // TODO: passenger should be a part of the TripRequestI, the user who requested the ride
  // We are now using the last passenger of the trip as the requester but this is not correct
  // Just a temporary solution to show
  const requestedBy =
    request.trip.passengers[request.trip.passengers.length - 1].user;
  return (
    <div
      className={
        'flex w-full flex-col rounded-lg bg-white outline outline-1 outline-light-gray ' +
        className
      }
    >
      <p
        className={`mb-2 w-full rounded-t-lg px-4 py-2 text-xl ${
          request.is_recurrent
            ? 'bg-turquoise text-white'
            : 'bg-light-gray text-black'
        }`}
      >
        Viaje {request.is_recurrent ? 'recurrente' : 'único'}
      </p>
      <TripCard
        className="-my-2"
        type="passenger"
        name={`${requestedBy.first_name} ${requestedBy.last_name}`} // TODO: Change this to the incoming passenger's name
        rating={0.0}
        origin={request.trip.driver_routine.origin.address}
        destination={request.trip.driver_routine.destination.address}
        price={Number.parseFloat(request.trip.driver_routine.price)}
        date={formatDatetime(request.trip.departure_datetime)}
        avatar={requestedBy.photo}
        href={NEXT_ROUTES.ACCEPT_RIDE(request.id)}
      />
    </div>
  );
}
