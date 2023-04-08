import TripCard from '@/components/cards/recommendation';
import TripCardSkeleton from '@/components/skeletons/TripCard';
import NEXT_ROUTES from '@/constants/nextRoutes';
import useHistoryTrips from '@/hooks/useHistoryTrips';
import TripRequestI from '@/interfaces/tripRequest';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const separateTrips = (historyTrips: TripRequestI[], userId: number) => {
  return historyTrips.reduce(
    (acc, tripRequest) => {
      if (tripRequest.trip.driver.user.id === userId) {
        acc.driverTrips.push(tripRequest);
      } else {
        acc.passengerTrips.push(tripRequest);
      }
      return acc;
    },
    { driverTrips: [], passengerTrips: [] }
  );
};

export default function HistoryTabs() {
  const USER_ID = 1;
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabClick = (index) => {
    setTabIndex(index);
  };

  const { historyTrips = [], isLoading, isError } = useHistoryTrips();

  const { driverTrips, passengerTrips } = separateTrips(historyTrips, USER_ID);

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
            <HistoryList
              trips={passengerTrips}
              type="passenger"
              isLoading={isLoading}
              isError={isError}
            />
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
            <HistoryList
              trips={driverTrips}
              type="passenger"
              isLoading={isLoading}
              isError={isError}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
const HistoryList = ({ trips, type, isLoading, isError }) => {
  const USER_ID = 1; // TODO: Get user id from context

  return (
    <div className="absolute w-full divide-y-2 divide-light-gray px-4">
      {!isError && trips && trips.length === 0 && (
        <div className="mx-4 mt-4 rounded-md border border-border-color py-5 text-center text-2xl font-light text-gray md:mx-5">
          No has realizado todavía ningún viaje.
        </div>
      )}
      {isLoading || isError
        ? [1, 2, 3, 4].map((i) => <TripCardSkeleton key={i} />)
        : trips.map((tripRequest: TripRequestI) => (
            <TripCard
              key={tripRequest.id}
              type={type}
              rating={0.0}
              name={`${tripRequest.trip.driver.user.first_name} ${tripRequest.trip.driver.user.last_name}`}
              avatar={tripRequest.trip.driver.user.photo}
              origin={tripRequest.trip.driver_routine.origin.address}
              destination={tripRequest.trip.driver_routine.destination.address}
              date={tripRequest.trip.departure_datetime}
              price={Number.parseFloat(tripRequest.trip.driver_routine.price)}
              href={NEXT_ROUTES.RATING_TRIP(USER_ID)}
              isHistory
            />
          ))}
    </div>
  );
};
