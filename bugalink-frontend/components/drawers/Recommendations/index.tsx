import { Link, SwipeableDrawer } from '@mui/material';
import { useEffect, useState } from 'react';
import TripI from '../../../interfaces/trip';
import axios from '../../../utils/axios';
import TripCard from '../../cards/recommendation';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function RecommendationsDrawer({ open, setOpen }: Props) {
  const [trips, setTrips] = useState<TripI[]>([]);

  useEffect(() => {
    if (!open) return; // Only fetch recommendations when the user opens the drawer

    const getRecommendedTrips = async () => {
      const { data } = await axios.get('/trips/recommendations');
      setTrips(data);
    };

    getRecommendedTrips();
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
          height: 'calc(70% - 90px)',
        },
      }}
    >
      <div className="overflow-scroll">
        <div
          className={`absolute -top-20 rounded-t-2xl bg-white w-full visible right-0 left-0 cursor-pointer`}
          onClick={() => setOpen(true)}
        >
          <div className="ml-4 mt-4">
            <div className="w-7 h-1.5 bg-light-gray rounded-lg absolute top-2 left-1/2 transform -translate-x-1/2"></div>
            <p className="font-lato font-semibold text-3xl">Recomendaciones</p>
            <p className="font-lato font-thin text-base text-gray mb-5 leading-3">
              En base a tu horario sin cubrir
            </p>
          </div>
        </div>
        <div className="trip-list grid justify-items-center mt-1 h-full overflow-auto">
          {trips.map((trip: TripI) => (
            <Link
              key={trip.id}
              href="/ride/V1StGXR8_Z5jdHi6B-myT/detailsOne?requested=false"
              className="w-full unstyle-link"
            >
              <TripCard
                key={trip.id}
                type={trip.type}
                rating={trip.rating}
                name={trip.driver.name}
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
    </SwipeableDrawer>
  );
}

RecommendationsDrawer.defaultProps = {
  open: false,
  setOpen: () => {
    return true;
  },
};
