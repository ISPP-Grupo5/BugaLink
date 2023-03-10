import { BackButtonText } from '../../../components/buttons/Back';
import { useRouter } from 'next/router';
import CTAButton from '../../../components/buttons/CTA';
import AnimatedLayout from '../../../components/layouts/animated';
import MapPreview from '../../../components/MapPreview';
import ProfileHeader from '../../../components/ProfileHeader';
import TargetPin from '/public/assets/map-mark.svg';
import SourcePin from '/public/assets/source-pin.svg';

export default function DetailsOne() {
   const router = useRouter();
   const { requested } = router.query;
  return (
    <AnimatedLayout>
      <div className="flex flex-col items-center justify-center h-screen">
        <BackButtonText text="Detalles del viaje" />
        <div className="bg-white px-5 pt-2 pb-44 overflow-y-scroll h-full">
          {/* Profile header */}
          <ProfileHeader
            name="Jesús Marchena"
            rating="4.8"
            numberOfRatings="14"
          />
          {/* Source and target destinations */}
          <div className="grid grid-cols-2 py-2 gap-2">
            <div>
              <p className="text-xs font-normal">Origen</p>
              <p className="text-xs font-bold">
                <SourcePin className="inline mr-2" />
                Escuela Técnica Superior de Ingeniería Informática (ETSII),
                41002 Sevilla
              </p>
            </div>
            <div>
              <p className="text-xs font-normal">Destino</p>
              <p className="text-xs font-bold">
                <TargetPin className="inline mr-2" />
                Avenida de Andalucía, 35, Dos Hermanas, 41002 Sevilla
              </p>
            </div>
          </div>
          {/* Map preview */}
          <MapPreview />
          {/* Details */}
          <div className="py-2">
            <p className="text-xs font-normal">Fecha y hora</p>
            <p className="text-xs font-medium text-justify">
              📅 Todos los viernes a las 21:00
            </p>
          </div>
          <div className="py-2">
            <p className="text-xs font-normal">Sobre el conductor</p>
            <p className="text-xs font-medium text-justify">
              🗣 Prefiero hablar durante el viaje
            </p>
            <p className="text-xs font-medium text-justify">
              🎶 Prefiero ir escuchando música
            </p>
            <p className="text-xs font-medium text-justify">
              🐾 Acepto mascotas
            </p>
            <p className="text-xs font-medium text-justify">
              🚭 No fumar en el coche
            </p>
          </div>
          <div className="py-2">
            <p className="text-xs font-normal">Nota del condutor</p>
            <p className="text-xs font-medium text-justify">
              ✏️ También puedo recoger pasajeros en otro punto si me pilla de
              camino. Mejor pregúntame por chat antes de reservar asiento
            </p>
          </div>
        </div>
        {/* Trip request */}
        <div className="w-full absolute bottom-0 bg-white rounded-t-xl shadow-t-md pt-5 px-5 my-3">
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
              <CTAButton className="my-4 w-11/12" text="CONTINUAR" />
            </div>
          )}
        </div>
      </div>
    </AnimatedLayout>
  );
}
