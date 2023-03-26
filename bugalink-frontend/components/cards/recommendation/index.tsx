import AvatarWithRating from '@/components/avatarWithRating';
import Entry from '@/components/cards/common/entry';
import Link from 'next/link';
import Calendar from '/public/assets/calendar.svg';
import MapPin from '/public/assets/map-pin.svg';
import OrigenPin from '/public/assets/origen-pin.svg';
import NEXT_ROUTES from '@/constants/nextRoutes';

type Params = {
  type?: string;
  rating: number;
  name: string;
  avatar: string;
  gender?: string;
  origin: string;
  destination: string;
  date: string;
  price: number;
  className?: string;
  isHistory: boolean;
};

export default function TripCard({
  type,
  rating,
  name,
  avatar,
  gender,
  origin,
  destination,
  date,
  price = 0,
  className = '',
  isHistory,
}: Params) {
  const isDriver = type === 'driver';
  const isMale = gender === 'M';
  const USER_ID = 1;

  // Role depending on isDriver and gender
  const role = isDriver
    ? isMale
      ? 'Conductor'
      : 'Conductora'
    : isMale
    ? 'Pasajero'
    : 'Pasajera';

  return (
    <>
      {isHistory === false && (
        <div
          className={
            'grid w-full grid-cols-2 grid-rows-4 gap-y-2 gap-x-4 p-4 pt-1 ' +
            className
          }
        >
          <span className="col-span-2 row-span-2 flex items-center space-x-4">
            <AvatarWithRating avatar={avatar} rating={rating} />
            <Entry title={role}>
              <p className="text-lg font-semibold leading-5">{name}</p>
            </Entry>
          </span>
          <Entry title="Origen">
            <OrigenPin className="flex-none" />
            <p className="truncate">{origin}</p>
          </Entry>
          <Entry title="Destino">
            <MapPin />
            <p className="truncate">{destination}</p>
          </Entry>
          <Entry title="Precio por asiento">
            {price.toLocaleString('es-ES', {
              style: 'currency',
              currency: 'EUR',
            })}
          </Entry>
          <Entry title="Fecha y hora">
            <Calendar />
            <p className="truncate">{date}</p>
          </Entry>
        </div>
      )}
      {isHistory && (
        <Link
          className={
            'grid w-full grid-cols-2 grid-rows-4 gap-y-2 gap-x-4 p-4 pt-1 ' +
            className
          }
          href={NEXT_ROUTES.RATING_RIDE(USER_ID)}
        >
          <span className="col-span-2 row-span-2 flex items-center space-x-4">
            <AvatarWithRating avatar={avatar} rating={rating} />
            <p className="text-lg font-semibold leading-5">{name}</p>
          </span>
          <Entry title="Origen">
            <OrigenPin className="flex-none" />
            <p className="truncate">{origin}</p>
          </Entry>
          <Entry title="Destino">
            <MapPin />
            <p className="truncate">{destination}</p>
          </Entry>
          <Entry title="Precio por asiento">
            {price.toLocaleString('es-ES', {
              style: 'currency',
              currency: 'EUR',
            })}
          </Entry>
          <Entry title="Fecha y hora">
            <Calendar />
            <p className="truncate">{date}</p>
          </Entry>
        </Link>
      )}
    </>
  );
}
