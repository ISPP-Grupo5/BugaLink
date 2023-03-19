import { motion } from 'framer-motion';
import { BackButton } from '../../../../components/buttons/Back';
import AnimatedLayout from '../../../../components/layouts/animated';
import Car from '/public/assets/car.svg';
import Progress from '/public/assets/progress.svg';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

export const LeafletMap = dynamic(
  () => import('../../../../components/maps/map'),
  { ssr: false }
);

export default function RideMap() {
  const [resultSource, setResultSource] = useState<[number, number] | null>(
    null
  );
  const [resultDestination, setResultDestination] = useState<
    [number, number] | null
  >(null);
  const [time, setTime] = useState<number>(0);

  const source =
    'Escuela Técnica Superior de Ingeniería Informática, 41002 Sevilla';
  const destination = 'Avenida de Andalucía, 35, Dos Hermanas, 41002 Sevilla';

  // salida a las 21:00 y llegada a las 21:00 mas el tiempo de viaje
  const startTime = new Date('2021-05-01T21:00:00');
  const endTime = new Date('2021-05-01T21:00:00');
  endTime.setMinutes(endTime.getMinutes() + time);

  useEffect(() => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${source}&key=AIzaSyD9tGiM0f6M9NDjoLCG853316Iv8UrdeAs`
    )
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        setResultSource([
          jsonData.results[0].geometry.location.lat,
          jsonData.results[0].geometry.location.lng,
        ]);
      })
      .catch((error) => {
        console.log(error);
      });

    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${destination}&key=AIzaSyD9tGiM0f6M9NDjoLCG853316Iv8UrdeAs`
    )
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        setResultDestination([
          jsonData.results[0].geometry.location.lat,
          jsonData.results[0].geometry.location.lng,
        ]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <AnimatedLayout>
      <BackButton className="sticky left-2 top-2 bg-base-origin py-3 pr-2 shadow-xl" />
      <div className="h-4/6 w-full object-cover">
        {resultDestination && resultSource && (
          <LeafletMap
            source={resultSource}
            destination={resultDestination}
            setTime={setTime}
          />
        )}
      </div>
      {/* <img src="/assets/mocks/map.png" className="h-full w-full object-cover" /> */}
      <div className="absolute bottom-0 z-10 -mt-6 grid w-full grid-rows-2 rounded-t-3xl bg-white px-5 py-6 drop-shadow-md">
        <span className="mb-4 grid grid-cols-2">
          <div className="text-ellipsis text-left">
            <p className="text-xs font-light text-gray">Origen</p>
            <p className="text-sm">{source}</p>
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
              {startTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <div>
              <p className="text-lg leading-none">{time} minutos</p>
              <p className="text-xs font-extralight leading-none tracking-tighter text-gray">
                aproximadamente
              </p>
            </div>
            <p className="text-3xl font-bold">
              {endTime.toLocaleTimeString([], {
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
