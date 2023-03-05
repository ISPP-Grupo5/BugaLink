import { motion } from 'framer-motion';
import BackButton from '../../../../components/buttons/Back';
import Layout from '../../../../components/Layout';
import Car from '/public/assets/car.svg';
import Progress from '/public/assets/progress.svg';

export default function RideMap() {
  return (
    <Layout>
      <BackButton />
      <img src="/assets/mocks/map.png" className="w-full" />
      <div className="fixed w-full bottom-0 bg-white rounded-t-3xl drop-shadow-md grid grid-rows-2 px-5 py-6 z-10">
        <span className="grid grid-cols-2 mb-4">
          <div className="text-left text-ellipsis">
            <p className="font-light text-gray text-xs">Origen</p>
            <p className="text-sm">
              Escuela Técnica Superior de Ingeniería Informática (ETSII), 41002
              Sevilla
            </p>
          </div>
          <div className="text-right">
            <p className="font-light text-gray text-xs">Destino</p>
            <p className="text-sm">
              Avenida de Andalucía, 35, Dos Hermanas, 41002 Sevilla
            </p>
          </div>
        </span>
        <div className="flex flex-col">
          <CarProgress />
          <span className="grid grid-cols-3 text-center items-center">
            <p className="text-3xl font-bold">21:00</p>
            <div>
              <p className="text-lg leading-none">15 minutos</p>
              <p className="font-extralight text-gray text-xs tracking-tighter leading-none">
                aproximadamente
              </p>
            </div>
            <p className="text-3xl font-bold">21:15</p>
          </span>
        </div>
      </div>
    </Layout>
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
