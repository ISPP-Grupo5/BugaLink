import { motion } from 'framer-motion';
import { BackButton } from '../../../../components/buttons/Back';
import AnimatedLayout from '../../../../components/layouts/animated';
import Car from '/public/assets/car.svg';
import Progress from '/public/assets/progress.svg';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import useMapCoordinates from '@/hooks/useMapCoordinates';

export const LeafletMap = dynamic(
  () => import('../../../../components/maps/map'),
  { ssr: false }
);

export default function RideMap() {
  const origin =
    'Escuela Técnica Superior de Ingeniería Informática, 41002 Sevilla';
  const destination = 'Avenida de Andalucía, 35, Dos Hermanas, 41002 Sevilla';
  const [time, setTime] = useState<number>(0);
  const originCoords = useMapCoordinates(origin);
  const destinationCoords = useMapCoordinates(destination);

  // salida a las 21:00 y llegada a las 21:00 mas el tiempo de viaje
  const startTime = new Date('2021-05-01T21:00:00');
  const endTime = new Date('2021-05-01T21:00:00');
  endTime.setMinutes(endTime.getMinutes() + time);

  return (
    <AnimatedLayout>
      <BackButton className="absolute left-2 top-2 bg-base-origin py-3 pr-2 shadow-xl" />
      <div className="h-4/6 w-full object-cover">
        <LeafletMap
          originCoords={originCoords?.coordinates}
          destinationCoords={destinationCoords?.coordinates}
          setTime={setTime}
        />
      </div>
      <div className="grid h-2/6 w-full grid-rows-2 rounded-t-3xl bg-white px-5 py-6 drop-shadow-md">
        <span className="mb-4 grid grid-cols-2">
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
