import TripCard from '@/components/cards/recommendation';
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
      <div className="relative mx-4 flex h-10 items-center rounded-full p-1 px-4 shadow-lg">
        <div className="flex w-full justify-center">
          <button onClick={() => handleTabClick(0)}>Pasajero</button>
        </div>
        <div className="flex w-full justify-center text-center">
          <button onClick={() => handleTabClick(1)}>Conductor</button>
        </div>
        <span
          className={`absolute flex h-8 w-1/2 items-center justify-center rounded-full text-white shadow transition-all duration-500 ${
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

  if (isLoading) return <p>Loading...</p>; // TODO: make skeleton
  if (isError) return <p>Error</p>; // TODO: make error message

  return (
    <div className="absolute divide-y-2 divide-light-gray ">
      {historyTrips.map((trip: TripI) => (
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
