import AvatarWithRating from '../../avatarWithRating';
import Calendar from '/public/assets/calendar.svg';
import MapPin from '/public/assets/map-pin.svg';
import OrigenPin from '/public/assets/origen-pin.svg';

export default function TripCard({
  type,
  rating,
  name,
  avatar,
  gender,
  origin,
  destination,
  date,
  price,
  className = '',
}) {
  const isDriver = type === 'driver';
  const isMale = gender === 'M';

  // Role depending on isDriver and gender
  const role = isDriver
    ? isMale
      ? 'Conductor'
      : 'Conductora'
    : isMale
    ? 'Pasajero'
    : 'Pasajera';

  return (
    <div
      className={
        'grid grid-cols-2 grid-rows-4 gap-y-2 gap-x-4 w-full p-4 pt-1 ' +
        className
      }
    >
      <span className="flex col-span-2 row-span-2 items-center space-x-4">
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
        {price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
      </Entry>
      <Entry title="Fecha y hora">
        <Calendar />
        <p className="truncate">{date}</p>
      </Entry>
    </div>
  );
}

const Entry = ({ children, title }) => {
  return (
    <div className="flex flex-col leading-4">
      <p className="font-thin text-xs text-gray">{title}</p>
      <div className="flex flex-row space-x-1 items-center font-medium text-xs ">
        {children}
      </div>
    </div>
  );
};
