import useHistoryTrips from '@/hooks/useHistoryTrips';
import TripI from '@/interfaces/trip';
import { Tabs } from 'flowbite-react';
import { BackButtonText } from '@/components/buttons/Back';
import TripCard from '@/components/cards/recommendation';
import AnimatedLayout from '@/components/layouts/animated';

export default function History() {
  return (
    <AnimatedLayout className=" flex flex-col overflow-y-scroll bg-white px-4">
      <div className="sticky top-0 z-10 bg-white">
        <BackButtonText text={'Historial'} />
      </div>
      <Tabs.Group
        className="justify-around"
        aria-label="Tabs with underline"
        style="underline"
      >
        <Tabs.Item title="Como conductor">
          <HistoryList type="driver" />
        </Tabs.Item>
        <Tabs.Item title="Como pasajero">
          <HistoryList type="passenger" />
        </Tabs.Item>
      </Tabs.Group>
    </AnimatedLayout>
  );
}

const HistoryList = (type) => {
  const { historyTrips, isLoading, isError } = useHistoryTrips(type);
  const USER_ID = 1; // TODO: Get user id from context

  if (isLoading) return <p>Loading...</p>; // TODO: make skeleton
  if (isError) return <p>Error</p>; // TODO: make error message

  return (
    <div className="divide-y-2 divide-light-gray ">
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
