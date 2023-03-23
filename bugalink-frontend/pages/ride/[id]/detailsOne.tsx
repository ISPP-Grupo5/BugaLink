import { BackButtonText } from '@/components/buttons/Back';
import CTAButton from '@/components/buttons/CTA';
import AnimatedLayout from '@/components/layouts/animated';
import MapPreview from '@/components/maps/mapPreview';
import ProfileHeader from '@/components/ProfileHeader';
import useMapCoordinates from '@/hooks/useMapCoordinates';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import TargetPin from '/public/assets/map-mark.svg';
import SourcePin from '/public/assets/source-pin.svg';

export default function DetailsOne() {
  const origin =
    'Escuela Técnica Superior de Ingeniería Informática, 41002 Sevilla';
  const destination = 'Avenida de Andalucía, 35, Dos Hermanas, 41002 Sevilla';

  const router = useRouter();
  const { requested } = router.query;

  const originCoords = useMapCoordinates(origin);
  const destinationCoords = useMapCoordinates(destination);

  const [time, setTime] = useState<number>(0);

  // salida a las 21:00 y llegada a las 21:00 mas el tiempo de viaje
  const startTime = new Date('2021-05-01T21:00:00');
  const endTime = new Date('2021-05-01T21:00:00');
  endTime.setMinutes(endTime.getMinutes() + time);

  return (
    <AnimatedLayout>
      <div className="flex h-screen flex-col items-center justify-center">
        <BackButtonText text="Detalles del viaje" />
        <div className="h-full overflow-y-scroll bg-white px-5 py-2">
          {/* Profile header */}
          <ProfileHeader
            name="Jesús Marchena"
            rating="4.8"
            numberOfRatings="14"
            photo="/assets/avatar.png"
          />
          {/* Origin and target destinations */}
          <div className="grid grid-cols-2 gap-2 py-2 text-sm">
            <div>
              <p className="text-gray">Origen</p>
              <p className="font-bold">
                <SourcePin className="mr-2 inline" />
                {origin}
              </p>
            </div>
            <div>
              <p>Destino</p>
              <p className="font-bold">
                <TargetPin className="mr-2 inline" />
                {destination}
              </p>
            </div>
          </div>
          {/* Map preview */}
          {!originCoords.isLoading && !destinationCoords.isLoading && (
            <MapPreview
              originCoords={originCoords.coordinates}
              destinationCoords={destinationCoords.coordinates}
              setTime={setTime}
              className="h-2/5"
            />
          )}
          {/* Details */}
          <div className="py-2">
            <p className="text-sm text-gray">Fecha y hora</p>
            <p className="text-md text-justify font-medium">
              📅 Todos los viernes a las{' '}
              {startTime.toLocaleString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="py-2">
            <p className="text-sm text-gray">Sobre el conductor</p>
            <p className="text-md text-justify font-medium">
              🗣 Prefiero hablar durante el viaje
            </p>
            <p className="text-md text-justify font-medium">
              🎶 Prefiero ir escuchando música
            </p>
            <p className="text-md text-justify font-medium">
              🐾 Acepto mascotas
            </p>
            <p className="text-md text-justify font-medium">
              🚭 No fumar en el coche
            </p>
          </div>
          <div className="py-2">
            <p className="text-sm font-normal text-gray">Nota del conductor</p>
            <p className="text-md text-justify font-lato font-medium leading-5">
              ✏️ También puedo recoger pasajeros en otro punto si me pilla de
              camino. Mejor pregúntame por chat antes de reservar asiento
            </p>
          </div>
        </div>
        {/* Trip request */}
        <div className="w-full rounded-t-xl bg-white py-3 px-5 pt-5 shadow-t-md">
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
