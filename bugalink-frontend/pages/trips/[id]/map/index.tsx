import { motion } from 'framer-motion';
import { BackButton } from '@/components/buttons/Back';
import AnimatedLayout from '@/components/layouts/animated';
import Car from '/public/assets/car.svg';
import Progress from '/public/assets/progress.svg';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import useMapCoordinates from '@/hooks/useMapCoordinates';
import useTrip from '@/hooks/useTrip';
import { GetServerSideProps } from 'next';

export const LeafletMap = dynamic(() => import('@/components/maps/map'), {
  ssr: false,
});

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  const data = {
    id: id,
  };

  return {
    props: { data },
  };
};

export default function RideMap({ data }) {
  const tripId = data.id;
  const { trip, isLoading, isError } = useTrip(tripId);

  const origin = trip?.driver_routine.origin.address;
  const destination = trip?.driver_routine.destination.address;

  const [time, setTime] = useState<number>(0);
  const [duration, setDuration] = useState<string>('');
  const originCoords = useMapCoordinates(origin);
  const destinationCoords = useMapCoordinates(destination);

  const startTime = new Date(trip?.departure_datetime);
  const endTime = new Date(trip?.departure_datetime);
  endTime.setMinutes(endTime.getMinutes() + time);

  if (isLoading) return <p>Loading...</p>; // TODO: make skeleton
  if (isError) return <p>Error</p>; // TODO: make error message

  return (
    <AnimatedLayout className="justify-between flex flex-col">
      <BackButton className="absolute left-2 top-2 bg-base-origin py-3 pr-2 shadow-xl" />
      <div className="-mb-8 h-full w-full">
        <LeafletMap
          originCoords={originCoords?.coordinates}
          destinationCoords={destinationCoords?.coordinates}
          setTime={setTime}
          setDuration={setDuration}
        />
      </div>
      <div className="grid w-full grid-rows-2 rounded-t-3xl bg-white px-5 py-6 drop-shadow-md">
        <span className="grid grid-cols-2">
          <div className="text-ellipsis text-left">
            <p className="text-xs font-light text-gray">Origen</p>
            <p className="text-sm">{origin}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-light text-gray">Destino</p>
            <p className="text-sm">{destination}</p>
          </div>
        </span>
        <div className="flex flex-col">
          <CarProgress />
          <span className="grid grid-cols-3 items-center text-center">
            <p className="text-3xl font-bold">
              {startTime.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <div>
              <p className="text-lg leading-none">{duration}</p>
              <p className="text-xs font-extralight leading-none tracking-tighter text-gray">
                aproximadamente
              </p>
            </div>
            <p className="text-3xl font-bold">
              {endTime.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </span>
        </div>
      </div>
    </AnimatedLayout>
  );
}

const carVariants = {
  start: {
    translateX: '0%',
    translateY: '50%',
  },
  end: {
    translateX: '45%',
    translateY: '50%',
  },
};

function CarProgress() {
  return (
    <div className="overflow-clip">
      <motion.div
        variants={carVariants}
        initial="start"
        animate="end"
        transition={{
          duration: 3,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatDelay: 0.5,
        }}
      >
        <Car />
      </motion.div>
      <Progress />
    </div>
  );
}
