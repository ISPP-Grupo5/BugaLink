import Image from 'next/image';

import dashboard from '/public/assets/mockups/dashboard.png';
import details from '/public/assets/mockups/details.png';
import payment from '/public/assets/mockups/payment.png';
import rate from '/public/assets/mockups/rate.png';
import timetable from '/public/assets/mockups/timetable.png';
import chat from '/public/assets/mockups/chat.png';
import { motion } from 'framer-motion';

export default function Features() {
  return (
    <section className="sectionSize bg-white xl:px-72 xl:py-20">
      <Feature
        title="Crea tu horario"
        description="Tú indicas ubicación, fecha y hora, nosotros nos encargamos del resto. Al crear tu horario comenzarás a recibir recomendaciones personalizadas de otros viajeros que compartan tu misma ruta. ¡Así de fácil!"
        images={[dashboard, timetable]}
      />
      <Feature
        title="Encuentra un conductor"
        description="¿Has encontrado a alguien que comparta tu ruta? ¡Perfecto! Contacta con el conductor y solicítale viajar con él. Te notificaremos cuando el conductor acepte tu solicitud."
        images={[details, chat]}
        imagesFirst
      />
      <Feature
        title="Paga de forma segura"
        description="Paga cada viaje de forma segura y sin comisiones. Puedes recargar saldo, o pagar con tarjeta o PayPal. El conductor recibirá tu pago cuando confirmes que el viaje ha ido bien."
        images={[payment, rate]}
      />
    </section>
  );
}

const Feature = ({ title, description, images, imagesFirst = false }) => {
  // Component to render each individual feature.
  // Only used in this file for <Features/>, so it's not exported.
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
      }}
      viewport={{ once: true }}
      className={`grid ${
        imagesFirst ? 'flex-col-reverse' : undefined
      } grid-cols-1 md:grid-cols-2 gap-y-10 md:gap-y-32 gap-x-10 md:gap-x-24 items-center mb-14`}
    >
      <div className={imagesFirst ? 'order-none md:order-2' : undefined}>
        <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-center text-black md:leading-tight sm:text-left md:text-5xl">
          {title}
        </h2>
        <p className="mb-5 text-base text-center text-gray-600 sm:text-left md:text-xl">
          {description}
        </p>
      </div>
      <div className="flex -space-x-20 w-full h-full justify-center">
        {images.map((image, index) => (
          <Image
            key={image.src}
            src={image}
            alt={Object.keys({ image }).pop()} // Use variable name as alt
            height={500}
            sizes="(max-width: 768px) 50vw, 100vw"
          />
        ))}
      </div>
    </motion.div>
  );
};
