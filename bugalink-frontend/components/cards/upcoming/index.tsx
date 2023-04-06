import Avatar from '@/components/avatar';
import NEXT_ROUTES from '@/constants/nextRoutes';
import TripI from '@/interfaces/trip';
import TripRequestI from '@/interfaces/tripRequest';
import UserI from '@/interfaces/user';
import { formatDatetime } from '@/utils/formatters';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Calendar from 'public/assets/calendar.svg';
import Destino from 'public/assets/destination.svg';
import Origen from 'public/assets/origen-pin.svg';
import WomanSeated from 'public/assets/woman-seated.svg';
import Tesla from 'public/icons/Vista-Principal/car.svg';

export default function UpcomingCard({
  trip: tripRequest,
  className = '',
}: {
  trip: TripRequestI;
  className?: string;
}) {
  const user = useSession().data?.user as User;
  const trip = tripRequest.trip; // Shorthand for not having to write tripRequest.trip all the time
  const isDriver = trip.driver.user.id === user?.user_id;
  const isRequested = true; // This should be taken from the backend, if the user has already requested this trip

  return (
    <Link
      data-cy="ride-details"
      className={
        'flex flex-col rounded-2xl shadow-md ' +
        (isDriver ? 'bg-turquoise ' : 'bg-green ') +
        className
      }
      href={NEXT_ROUTES.RIDE_DETAILS_ONE(tripRequest.id, isRequested)}
    >
      {isDriver ? (
        <DriverCardHeader trip={trip} />
      ) : (
        <PassengerCardHeader trip={trip} />
      )}
      <div className="space-y-0.5 p-3 text-lg">
        <div className="flex flex-row items-center space-x-2 text-white">
          <Origen className="h-min w-4 flex-none" />
          <p className="truncate">{trip.driver_routine.origin.address}</p>
        </div>
        <div className="flex items-center space-x-2 truncate text-white">
          <Destino
            className={
              'mx-0.5 mt-1.5 flex-none scale-110 ' +
              (isDriver ? 'text-light-turquoise' : 'text-pale-green')
            }
          />
          <p className="truncate">{trip.driver_routine.destination.address}</p>
        </div>
        <div className="flex items-center space-x-2 truncate text-white">
          <Calendar className="h-min w-4 flex-none" />
          <p className="truncate">{formatDatetime(trip.departure_datetime)}</p>
        </div>
      </div>
    </Link>
  );
}

const DriverCardHeader = ({ trip }: { trip: TripI }) => (
  <div className="relative flex h-28 flex-none flex-col overflow-clip rounded-2xl bg-white shadow-xl">
    <span className="flex justify-end -space-x-7">
      <Flag text="COMO CONDUCTOR" color="bg-turquoise" className="z-10" />
    </span>
    <Tesla className="absolute -right-6 bottom-0 w-32 origin-bottom-right" />
    <span className="flex h-full items-center px-3">
      <span className="flex items-start -space-x-10">
        {trip.passengers.slice(0, 3).map((passenger, index) => (
          <Avatar
            className="w-14 border-2 border-white"
            style={{ zIndex: 3 - index }} // for reverse stacking
            key={`passenger-${index}`}
            id={`passenger-${index}`}
            src={passenger.user.photo}
          />
        ))}
      </span>
      <div className="z-10 ml-3 flex flex-col -space-y-1 overflow-hidden whitespace-nowrap">
        <p className="text-xs text-gray">Pasajeros</p>
        {trip.passengers
          .slice(0, trip.passengers.length === 3 ? 3 : 2)
          .map((passenger, index) => (
            <p
              key={`passenger-${index}`}
              className="text-md truncate leading-5"
            >
              {passenger.user.first_name
                .split(' ')
                .map((name, idx) => (idx > 0 ? name.charAt(0) + '.' : name))
                .join(' ')}{' '}
              {passenger.user.last_name.split(' ')[0]}
            </p>
          ))}
        {trip.passengers.length > 3 && (
          <p className="text-sm font-semibold leading-5">
            y {trip.passengers.length - 2} más...
          </p>
        )}
      </div>
    </span>
  </div>
);

const PassengerCardHeader = ({ trip }: { trip: TripI }) => (
  <div className="relative flex h-28 flex-none flex-col overflow-clip rounded-2xl rounded-br-3xl bg-white shadow-xl">
    <span className="flex justify-end -space-x-7">
      {trip.status === 'PENDING' && (
        <Flag
          text="PENDIENTE"
          color="bg-orange"
          className="right-32 pl-2.5 pr-8"
        />
      )}
      <Flag text="COMO PASAJERO" color="bg-green" className="z-10" />
    </span>
    <WomanSeated className="absolute -right-2.5 top-[2.35rem] z-20 w-24" />
    <span className="flex h-full items-center space-x-3 px-3">
      <Avatar className="w-14" src={trip.driver.user.photo} />
      <div className="flex flex-col -space-y-1">
        <p className="text-lg font-extrabold leading-5 tracking-wide">
          {/* TODO: license plate not present in API response */}
          1234ABC
        </p>
        <p className="truncate text-sm text-gray">
          {/* TODO: not in petition either */}
          Tesla Model S
        </p>
        <p className="truncate">
          {trip.driver.user.first_name}{' '}
          {trip.driver.user.last_name.split(' ')[0]}
        </p>
      </div>
    </span>
  </div>
);

const Flag = ({
  text, // PENDIENTE, COMO PASAJERO, COMO CONDUCTOR...
  color, // bg-green, bg-turquoise, bg-orange
  className = '',
}: {
  text: string;
  color: string;
  className?: string;
}) => (
  <div
    className={`${color} truncate rounded-bl-3xl rounded-tr-2xl px-2.5 py-1 ${className}`}
  >
    <p className="text-semibold text-white">{text}</p>
  </div>
);
