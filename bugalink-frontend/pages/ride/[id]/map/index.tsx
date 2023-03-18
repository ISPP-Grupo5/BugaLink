import { motion } from 'framer-motion';
import { BackButton } from '../../../../components/buttons/Back';
import AnimatedLayout from '../../../../components/layouts/animated';
import Car from '/public/assets/car.svg';
import Progress from '/public/assets/progress.svg';

export default function RideMap() {
  return (
    <AnimatedLayout>
      <BackButton className="absolute left-2 top-2 bg-base-origin py-3 pr-2 shadow-xl" />
      <img src="/assets/mocks/map.png" className="h-full w-full object-cover" />
      <div className="sticky bottom-0 z-10 -mt-6 grid w-full grid-rows-2 rounded-t-3xl bg-white px-5 py-6 drop-shadow-md">
        <span className="mb-4 grid grid-cols-2">
          <div className="text-ellipsis text-left">
            <p className="text-xs font-light text-gray">Origen</p>
            <p className="text-sm">
              Escuela Técnica Superior de Ingeniería Informática (ETSII), 41002
              Sevilla
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-light text-gray">Destino</p>
            <p className="text-sm">
              Avenida de Andalucía, 35, Dos Hermanas, 41002 Sevilla
            </p>
          </div>
        </span>
        <div className="flex flex-col">
          <CarProgress />
          <span className="grid grid-cols-3 items-center text-center">
            <p className="text-3xl font-bold">21:00</p>
            <div>
              <p className="text-lg leading-none">15 minutos</p>
              <p className="text-xs font-extralight leading-none tracking-tighter text-gray">
                aproximadamente
              </p>
            </div>
            <p className="text-3xl font-bold">21:15</p>
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
