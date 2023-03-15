import Link from 'next/link';
import TripCard from '../components/cards/recommendation';
import TripI from '../interfaces/trip';

type props = {
  trips: TripI[];
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function TripList({ trips, open, setOpen }: props) {
  // TODO: check if this is still used. I moved it to the RecommendationsDrawer component because it was only used there
  return (
    <div className="overflow-scroll">
      <div
        className={`absolute -top-20 rounded-t-xl bg-white w-full visible right-0 left-0 cursor-pointer`}
        onClick={() => setOpen(true)} // TODO: does this have to be here?
      >
        <div className="ml-4 mt-4">
          <div className="w-7 h-1.5 bg-light-gray rounded-lg absolute top-2 left-1/2 transform -translate-x-1/2"></div>
          <p className="font-lato font-semibold text-3xl">Recomendaciones</p>
          <p className="font-lato font-thin text-base text-gray mb-5 leading-3">
            En base a tu horario sin cubrir
          </p>
        </div>
      </div>
      <div className="trip-list grid justify-items-center mt-6 h-full overflow-auto">
        {trips.map((trip: TripI) => (
          <Link
            key={trip.name}
            href="/ride/V1StGXR8_Z5jdHi6B-myT/detailsOne?requested=false"
            className="w-full"
          >
            <TripCard
              key={trip.name}
              type={trip.type}
              rating={trip.rating}
              name={trip.name}
              gender={trip.gender}
              avatar={trip.avatar}
              origin={trip.origin}
              destination={trip.destination}
              date={trip.date}
              price={trip.price}
              className="bg-white rounded-md outline outline-1 outline-light-gray"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
