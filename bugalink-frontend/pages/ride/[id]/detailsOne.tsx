import { BackButtonText } from '../../../components/buttons/Back';
import { useRouter } from 'next/router';
import CTAButton from '../../../components/buttons/CTA';
import AnimatedLayout from '../../../components/layouts/animated';
import MapPreview from '../../../components/maps';
import ProfileHeader from '../../../components/ProfileHeader';
import TargetPin from '/public/assets/map-mark.svg';
import SourcePin from '/public/assets/source-pin.svg';
import Link from 'next/link';
import { useState } from 'react';

export default function DetailsOne() {
  const router = useRouter();
  const { requested } = router.query;

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

  return (
    <AnimatedLayout>
      <div className="flex h-screen flex-col items-center justify-center">
        <BackButtonText text="Detalles del viaje" />
        <div className="h-full overflow-y-scroll bg-white px-5 pt-2 pb-44">
          {/* Profile header */}
          <ProfileHeader
            name="Jesús Marchena"
            rating="4.8"
            numberOfRatings="14"
          />
          {/* Source and target destinations */}
          <div className="grid grid-cols-2 gap-2 py-2">
            <div>
              <p className="text-xs font-normal">Origen</p>
              <p className="text-xs font-bold">
                <SourcePin className="mr-2 inline" />
                {source}
              </p>
            </div>
            <div>
              <p className="text-xs font-normal">Destino</p>
              <p className="text-xs font-bold">
                <TargetPin className="mr-2 inline" />
                {destination}
              </p>
            </div>
          </div>
          {/* Map preview */}
          {source && destination && (
            <MapPreview
              source={source}
              resultSource={resultSource}
              setResultSource={setResultSource}
              destination={destination}
              resultDestination={resultDestination}
              setResultDestination={setResultDestination}
              setTime={setTime}
              className="h-3/6"
            />
          )}
          {/* Details */}
          <div className="py-2">
            <p className="text-xs font-normal">Fecha y hora</p>
            <p className="text-justify text-xs font-medium">
              📅 Todos los viernes a las{' '}
              {startTime.toLocaleString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="py-2">
            <p className="text-xs font-normal">Sobre el conductor</p>
            <p className="text-justify text-xs font-medium">
              🗣 Prefiero hablar durante el viaje
            </p>
            <p className="text-justify text-xs font-medium">
              🎶 Prefiero ir escuchando música
            </p>
            <p className="text-justify text-xs font-medium">
              🐾 Acepto mascotas
            </p>
            <p className="text-justify text-xs font-medium">
              🚭 No fumar en el coche
            </p>
          </div>
          <div className="py-2">
            <p className="text-xs font-normal">Nota del condutor</p>
            <p className="text-justify text-xs font-medium">
              ✏️ También puedo recoger pasajeros en otro punto si me pilla de
              camino. Mejor pregúntame por chat antes de reservar asiento
            </p>
          </div>
        </div>
        {/* Trip request */}
        <div className="absolute bottom-0 my-3 w-full rounded-t-xl bg-white px-5 pt-5 shadow-t-md">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <p className="text-xs font-normal">Tipo de viaje</p>
              <p className="text-xl font-bold">Recurrente</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-normal">Precio por asiento</p>
              <p className="text-xl font-bold">2,00€</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-normal">Plazas libres</p>
              <p className="text-xl font-bold">2</p>
            </div>
          </div>
          {requested === 'false' && (
            <div className="flex justify-center">
              <Link
                href="/ride/V1StGXR8_Z5jdHi6B-myT/detailsTwo"
                className="flex w-11/12 justify-center"
              >
                <CTAButton className="my-4 w-11/12" text="CONTINUAR" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </AnimatedLayout>
  );
}
