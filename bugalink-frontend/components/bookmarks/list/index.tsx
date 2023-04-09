import InformativeCard from '@/components/cards/informative';
import TripCard from '@/components/cards/recommendation';
import NEXT_ROUTES from '@/constants/nextRoutes';
import useBookmarkTrip from '@/hooks/useBookmarkTrip';
import TripI from '@/interfaces/trip';
import { shortenName } from '@/utils/formatters';

export default function BookmarkTripList() {
  const { bookmarkedTrips } = useBookmarkTrip();

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-4">
      {bookmarkedTrips?.map((trip: TripI) => (
        <TripCard
          isHistory
          key={trip.id}
          rating={0}
          name={shortenName(
            trip.driver.user.first_name,
            trip.driver.user.last_name
          )}
          avatar={trip.driver.user.photo}
          origin={trip.driver_routine.origin.address}
          destination={trip.driver_routine.destination.address}
          date={trip.departure_datetime}
          price={Number.parseFloat(trip.driver_routine.price)}
          href={NEXT_ROUTES.TRIP_DETAILS(trip.id)}
          className="w-full rounded-md bg-white outline outline-1 outline-light-gray"
        />
      ))}
      {!bookmarkedTrips?.length && (
        <InformativeCard>
          ¿Has encontrado un viaje que te interesa?
          <br />
          ¡Guárdalo y aparecerá aquí!
        </InformativeCard>
      )}
    </div>
  );
}
