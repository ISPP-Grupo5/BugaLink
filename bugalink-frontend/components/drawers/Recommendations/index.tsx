import { TripCard } from '@/components/cards/recommendation';
import useRecommendedTrips from '@/hooks/useRecommendedTrips';
import TripI from '@/interfaces/trip';
import { Link, SwipeableDrawer } from '@mui/material';
import { useState, useEffect } from 'react';

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
          <div className="ml-4 mt-4">
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

  if (isLoading) return <p>Loading...</p>; // TODO: make skeleton
  if (isError) return <p>Error</p>; // TODO: make error message

  return (
    <div className="trip-list mt-1 grid h-full justify-items-center overflow-auto">
      {trips.map((trip: TripI) => (
        <Link
          key={trip.id}
          href="/ride/V1StGXR8_Z5jdHi6B-myT/detailsOne?requested=false"
          className="unstyle-link w-full"
        >
          <TripCard
            key={trip.id}
            type={'recurring'}
            rating={0}
            name={trip.driver.name}
            gender={'M'}
            avatar={trip.driver.photo}
            origin={trip.origin}
            destination={trip.destination}
            date={trip.date}
            price={trip.price}
            className="rounded-md bg-white outline outline-1 outline-light-gray"
          />
        </Link>
      ))}
    </div>
  );
};
RecommendationsDrawer.defaultProps = {
  open: false,
  setOpen: () => {
    return true;
  },
};
