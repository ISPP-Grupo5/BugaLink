import TripCard from '../recommendation';

export default function RequestCard({
  type,
  passengerType,
  rating,
  name,
  avatar,
  gender,
  origin,
  destination,
  price,
  date,
  className = '',
}) {
  const isRecurring = passengerType === 'recurring';

  return (
    <div
      className={
        'flex flex-col w-full bg-white outline outline-1 outline-light-gray rounded-lg ' +
        className
      }
    >
      <p
        className={`w-full px-4 text-xl py-2 mb-2 rounded-t-lg ${
          isRecurring
            ? 'bg-light-turquoise text-white'
            : 'bg-lightGray text-black'
        }`}
      >
        Viaje {isRecurring ? 'recurrente' : 'único'}
      </p>
      <TripCard
        className="-my-2"
        type={type}
        rating={rating}
        name={name}
        avatar={avatar}
        gender={gender}
        origin={origin}
        destination={destination}
        date={date}
        price={price}
      />
    </div>
  );
}
