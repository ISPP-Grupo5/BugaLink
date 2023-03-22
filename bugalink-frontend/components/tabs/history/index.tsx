import TripCard from '@/components/cards/recommendation';
import TripCardSkeleton from '@/components/skeletons/TripCard';
import useHistoryTrips from '@/hooks/useHistoryTrips';
import TripI from '@/interfaces/trip';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

export default function HistoryTabs() {
  const [tabIndex, setTabIndex] = useState(0);
  const passengerTrips = useHistoryTrips('passenger');
  const driverTrips = useHistoryTrips('driver');
  const handleTabClick = (index) => {
    setTabIndex(index);
  };

  return (
    <div className="h-full w-full space-y-2">
      <div className="relative mx-4 mt-1 flex h-10 select-none items-center justify-around rounded-full p-1 px-4 shadow-lg">
        <button className="grow" onClick={() => handleTabClick(0)}>
          Pasajero
        </button>
        <button className="grow" onClick={() => handleTabClick(1)}>
          Conductor
        </button>
        <span
          className={`absolute flex h-8 w-1/2 items-center justify-center rounded-full text-white shadow transition-all duration-300 ${
            tabIndex === 0
              ? 'left-1 translate-x-0 bg-green'
              : '-left-1 translate-x-full bg-turquoise'
          }`}
          onClick={() => handleTabClick(tabIndex === 0 ? 1 : 0)}
        >
          {tabIndex === 0 ? 'Pasajero' : 'Conductor'}
        </span>
      </div>
      <AnimatePresence mode="popLayout">
        {tabIndex === 0 ? (
          <motion.div
            id="A"
            key="passenger"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <HistoryList trips={passengerTrips} />
          </motion.div>
        ) : (
          <motion.div
            id="B"
            key="driver"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <HistoryList trips={driverTrips} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
const HistoryList = ({ trips }) => {
  const { historyTrips, isLoading, isError } = trips;
  const USER_ID = 1; // TODO: Get user id from context

  return (
    <div className="absolute w-full divide-y-2 divide-light-gray px-4">
      {isLoading || isError
        ? [1, 2, 3, 4].map((i) => <TripCardSkeleton key={i} />)
        : historyTrips.map((trip: TripI) => (
            <TripCard
              key={trip.id}
              type={trip.driver.id === USER_ID ? 'driver' : 'passenger'}
              rating={0.0}
              name={trip.driver.name}
              avatar={trip.driver.photo}
              gender={'M'}
              origin={trip.origin}
              destination={trip.destination}
              date={trip.date}
              price={trip.price}
            />
          ))}
    </div>
  );
};
