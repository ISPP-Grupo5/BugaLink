import TripRequestI from '@/interfaces/tripRequest';
import { TripCard } from '@/components/cards/recommendation';

type Props = {
  request: TripRequestI;
  className?: string;
};

export default function RequestCard({ request, className = '' }: Props) {
  const isRecurring = request.type === 'recurring';

  return (
    <div
      className={
        'flex w-full flex-col rounded-lg bg-white outline outline-1 outline-light-gray ' +
        className
      }
    >
      <p
        className={`mb-2 w-full rounded-t-lg px-4 py-2 text-xl ${
          isRecurring ? 'bg-turquoise text-white' : 'bg-light-gray text-black'
        }`}
      >
        Viaje {isRecurring ? 'recurrente' : 'único'}
      </p>
      <TripCard
        className="-my-2"
        type="passenger"
        name={request.requestedBy.name} // TODO: Change this to the incoming passenger's name
        rating={request.requestedBy.rating}
        gender={request.requestedBy.gender}
        origin={request.origin}
        destination={request.destination}
        price={request.price}
        date={request.date}
        avatar={request.requestedBy.avatar}
      />
    </div>
  );
}
