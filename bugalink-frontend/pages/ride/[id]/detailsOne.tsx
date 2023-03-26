import { BackButtonText } from '@/components/buttons/Back';
import CTAButton from '@/components/buttons/CTA';
import AnimatedLayout from '@/components/layouts/animated';
import MapPreview from '@/components/maps/mapPreview';
import ProfileHeader from '@/components/ProfileHeader';
import useMapCoordinates from '@/hooks/useMapCoordinates';
import useReviews from '@/hooks/useReviews';
import useRideDetails from '@/hooks/useRideDetails';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import TargetPin from '/public/assets/map-mark.svg';
import SourcePin from '/public/assets/source-pin.svg';


export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  const data = {
    id: id,
  }

  return {
    props: { data },
  };
};

export default function DetailsOne({ data }) {
  const [origin, setOrigin] = useState();
  const [destination, setDestination] = useState();
  const [driver_id, setDriverId] = useState();

  const originCoords = useMapCoordinates(origin);
  const destinationCoords = useMapCoordinates(destination);

  const router = useRouter();
  const { requested } = router.query;

  const dayDictionary = {
    Mon: 'Lunes',
    Tue: 'Martes',
    Wed: 'Miércoles',
    Thu: 'Jueves',
    Fri: 'Viernes',
    Sat: 'Sábado',
    Sun: 'Domingo',
  };

  const [time, setTime] = useState<number>(0);

  // salida a las 21:00 y llegada a las 21:00 mas el tiempo de viaje
  //const startTime = new Date('2021-05-01T21:00:00');
  const endTime = new Date('2021-05-01T21:00:00');
  endTime.setMinutes(endTime.getMinutes() + time);


  const ride_id = data.id;
  const { rideData, isLoading, isError } = useRideDetails(ride_id);
  let driverId = rideData ? rideData.driver_id : 'Loading...';

  const { reviews } = useReviews(driverId);


  useEffect(() => {
    if (rideData) {
      setOrigin(rideData.ride.start_location);
      setDestination(rideData.ride.end_location);

      
    }
  }, [rideData]);

  let startTime = rideData ? rideData.start_time_0 : 'Loading...';
  startTime = startTime.substr(0, 5);

  let nextUrl = "/ride/" + ride_id +"/detailsTwo";

  return (
    <AnimatedLayout>
      <div className="flex h-screen flex-col items-center justify-center">
        <BackButtonText text="Detalles del viaje" />
        <div className="h-full overflow-y-scroll bg-white px-5 py-2">
          {/* Profile header */}
          <ProfileHeader
            name={reviews && reviews.username ? reviews.username : 'Loading...'}
            rating={reviews && reviews.rating ? reviews.rating : 'Loading...'}
            numberOfRatings={reviews && reviews.total_ratings? reviews.total_ratings : 'Loading...'}
            photo={reviews && reviews.profile_photo ? reviews.profile_photo : '/assets/avatar.png'}
          />
          {/* Origin and target destinations */}
          <div className="grid grid-cols-2 gap-2 py-2 text-sm">
            <div>
              <p className="text-gray">Origen</p>
              <p className="font-bold">
                <SourcePin className="mr-2 inline" />
                {rideData && rideData.ride.start_location ? rideData.ride.start_location : 'No se ha encontrado'}
              </p>
            </div>
            <div>
              <p>Destino</p>
              <p className="font-bold">
                <TargetPin className="mr-2 inline" />
                {rideData && rideData.ride.end_location ? rideData.ride.end_location : 'No se ha encontrado'}
              </p>
            </div>
          </div>
          {/* Map preview */}
          {origin && destination && (
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
              📅 Todos los{' '}
              {rideData? dayDictionary[rideData.day] : "Loading..."}
              {' '}a las{' '}
              {startTime.toLocaleString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="py-2">
            <p className="text-sm text-gray">Sobre el conductor</p>
            
            
            <p className="text-md text-justify font-medium">
              {rideData && rideData.driver_preferences.preference_0 ? '🚬 Puedes fumar en mi coche' : '🚭 Mi coche es libre de humos'}
            </p>
            <p className="text-md text-justify font-medium">
              {rideData && rideData.driver_preferences.preference_0 ? '🔉 Prefiero ir escuchando música' : '🔇 Prefiero no escuchar musica'}
            </p>
            <p className="text-md text-justify font-medium">
              {rideData && rideData.driver_preferences.preference_0 ? '🐾 Puedes traer a tu mascota' : '😿 No acepto mascotas'}
            </p>
            <p className="text-md text-justify font-medium">
              {rideData && rideData.driver_preferences.preference_0 ? '🗣 Prefiero hablar durante el camino' : '🤐 Prefiero no hablar durante el camino'}
            </p>
          </div>
          <div className="py-2">
            <p className="text-sm font-normal text-gray">Nota del conductor</p>
            <p className="text-md text-justify font-medium leading-5">
              {rideData && rideData.driver_note ? '✏️' + rideData.driver_note : "✏️ El conductor no ha dejado ninguna nota"}
 
            </p>
          </div>
        </div>
        {/* Trip request */}
        <div className="w-full rounded-t-xl bg-white py-3 px-5 pt-5 shadow-t-md">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <p className="text-xs font-normal">Tipo de viaje</p>
              <p className="text-xl font-bold">{rideData && rideData.recurrent ? 'Recurrente' : 'Individual'}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-normal">Precio por asiento</p>
              <p className="text-xl font-bold">{rideData ? rideData.price : 'Loading...'}€</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-normal">Plazas libres</p>
              <p className="text-xl font-bold">{rideData ? rideData.available_seats : 'Loading...'}</p>
            </div>
          </div>
          {(
            <div className="flex justify-center">
              <Link
                href={nextUrl}
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
