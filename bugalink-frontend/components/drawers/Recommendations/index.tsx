import InformativeCard from '@/components/cards/informative';
import TripCard from '@/components/cards/recommendation';
import TripCardSkeleton from '@/components/skeletons/TripCard';
import NEXT_ROUTES from '@/constants/nextRoutes';
import useRecommendedTrips from '@/hooks/useRecommendedTrips';
import TripI from '@/interfaces/trip';
import { SwipeableDrawer } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function RecommendationsDrawer({ open, setOpen }: Props) {
  const [isFirstLoaded, setIsFirstLoaded] = useState(false);

  useEffect(() => {
    if (open) setIsFirstLoaded(true);
  }, [open]);

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      swipeAreaWidth={80}
      disableSwipeToOpen={false}
      ModalProps={{
        keepMounted: true,
      }}
      id="SwipeableDrawer"
      allowSwipeInChildren={true}
      SlideProps={{
        style: {
          minWidth: '320px',
          maxWidth: '480px',
          width: '100%',
          margin: '0 auto',
          overflow: 'visible',
          height: 'calc(80%)',
        },
      }}
    >
      <div className="overflow-scroll">
        <div
          className={`visible absolute -top-20 right-0 left-0 w-full cursor-pointer rounded-t-2xl bg-white`}
          onClick={() => setOpen(true)}
        >
          <div className="mx-auto mt-4 text-center">
            <div className="absolute top-2 left-1/2 h-1.5 w-7 -translate-x-1/2 transform rounded-lg bg-light-gray"></div>
            <p className="text-3xl font-semibold">Recomendaciones</p>
            <p className="mb-5 text-base font-thin leading-3 text-gray">
              En base a tu horario sin cubrir
            </p>
          </div>
        </div>
        {isFirstLoaded && <RecommendationsList />}
      </div>
    </SwipeableDrawer>
  );
}

// Inner component that fetches and renders the list of recommendations only when the drawer is open
const RecommendationsList = () => {
  const { trips, isLoading, isError } = useRecommendedTrips();

  return (
    <div className="trip-list mt-1 grid h-full justify-items-center overflow-auto">
      {isLoading || isError
        ? [1, 2, 3, 4].map((i) => (
            <TripCardSkeleton
              key={i}
              className="rounded-md bg-white outline outline-1 outline-light-gray"
            />
          ))
        : trips.map((trip: TripI) => (
            <TripCard
              isHistory
              key={trip.id}
              rating={0}
              name={trip.driver.user.first_name}
              avatar={trip.driver.user.photo}
              origin={trip.driver_routine.origin.address}
              destination={trip.driver_routine.destination.address}
              date={trip.departure_datetime}
              price={Number.parseFloat(trip.driver_routine.price)}
              href={NEXT_ROUTES.TRIP_DETAILS(trip.id)}
              className="w-full rounded-md bg-white outline outline-1 outline-light-gray"
            />
          ))}
      {trips && trips.length === 0 && (
        <div className="p-2">
          <InformativeCard className="px-2">
            Vaya, no hay nada por aquí.
            <br />
            {
              <Link
                className="font-normal text-turquoise"
                href={NEXT_ROUTES.NEW_ROUTINE_PASSENGER}
              >
                Crea una rutina
              </Link>
            }{' '}
            para recibir sugerencias personalizadas.
          </InformativeCard>
        </div>
      )}
    </div>
  );
};
RecommendationsDrawer.defaultProps = {
  open: false,
  setOpen: () => {
    return true;
  },
};
