import ProfileHeader from '@/components/ProfileHeader';
import { BackButtonText } from '@/components/buttons/Back';
import CTAButton from '@/components/buttons/CTA';
import AnimatedLayout from '@/components/layouts/animated';
import MapPreview from '@/components/maps/mapPreview';
import NEXT_ROUTES from '@/constants/nextRoutes';
import { WEEK_DAYS } from '@/constants/weekDays';
import useDriverPreferences from '@/hooks/useDriverPreferences';
import useSentRequests from '@/hooks/useSentRequests';
import useTrip from '@/hooks/useTrip';
import useUserStats from '@/hooks/useUserStats';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import TargetPin from '/public/assets/map-mark.svg';
import SourcePin from '/public/assets/source-pin.svg';
import { User } from 'next-auth';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  const data = {
    id: id,
  };

  return {
    props: { data },
  };
};

export default function Details({ data }) {
  const router = useRouter();
  const tripId = data.id;

  const user = useSession().data?.user as User;

  const { sentRequests } = useSentRequests();
  const { trip, isLoading, isError } = useTrip(tripId);
  const { userStats, isLoadingStats, isErrorStats } = useUserStats(
    trip?.driver.user.id
  );
  const { preferences, isLoadingPreferences, isErrorPreferences } =
    useDriverPreferences(trip?.driver.id);
  const [time, setTime] = useState<number>(0);

  // salida a las 21:00 y llegada a las 21:00 mas el tiempo de viaje
  const startTime = new Date(trip?.departure_datetime);
  const endTime = new Date(trip?.departure_datetime);
  endTime.setMinutes(endTime.getMinutes() + time);
  const origin = trip?.driver_routine.origin;
  const destination = trip?.driver_routine.destination;

  const alreadyRequestedTrip = sentRequests?.find(
    (request) => request.trip.id.toString() === tripId
  );

  const iAmTheDriver = userStats?.id === user?.user_id;

  if (isLoading || isLoadingStats || isLoadingPreferences)
    return <p>Loading...</p>; // TODO: make skeleton
  if (isError || isErrorStats || isErrorPreferences) return <p>Error</p>; // TODO: make error message

  return (
    <AnimatedLayout>
      <div className="flex h-screen flex-col items-center justify-center">
        <BackButtonText text="Detalles del viaje" />
        <div className="h-full w-full overflow-y-scroll bg-white px-5 py-2">
          <ProfileHeader user={userStats} />
          {/* Origin and target destinations */}
          <div className="grid grid-cols-2 gap-2 py-2 text-sm">
            <div>
              <p className="text-gray">Origen</p>
              <p>
                <SourcePin className="mr-2 inline -translate-y-0.5" />
                {origin.address}
              </p>
            </div>
            <div>
              <p>Destino</p>
              <p>
                <TargetPin className="mr-2 inline -translate-y-0.5" />
                {destination.address}
              </p>
            </div>
          </div>
          {/* Map preview */}
          {origin && destination && (
            <MapPreview
              tripId={tripId}
              originCoords={{ lat: origin.latitude, lng: origin.longitude }}
              destinationCoords={{
                lat: destination.latitude,
                lng: destination.longitude,
              }}
              setTime={setTime}
              className="h-2/5"
            />
          )}
          {/* Details */}
          <div className="py-2">
            <p className="text-sm text-gray">Fecha y hora</p>
            <p className="text-md text-justify font-medium">
              📅 Todos los {WEEK_DAYS[trip?.driver_routine.day_of_week]} a las{' '}
              {/*TODO: el toLocaleString creo que está sumando dos horas, REVISAR */}
              {startTime.toLocaleString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="py-2">
            <p className="text-sm text-gray">Sobre el conductor</p>
            {/* TODO: coger estos datos de las constantes de preferences.ts */}
            <p className="text-md text-justify font-medium">
              {preferences?.prefers_talk
                ? '🗣 Prefiero hablar durante el viaje'
                : '🤫 Prefiero no hablar durante el viaje'}
            </p>
            <p className="text-md text-justify font-medium">
              {preferences?.prefers_music
                ? '🎶 Prefiero ir escuchando música'
                : '🔇 Prefiero ir sin música'}
            </p>
            <p className="text-md text-justify font-medium">
              {preferences?.allows_pets
                ? '🐾 Acepto mascotas'
                : '😿 No acepto mascotas'}
            </p>
            <p className="text-md text-justify font-medium">
              {preferences?.allows_smoke
                ? '🚬 Se puede fumar en el coche'
                : '🚭 No fumar en el coche'}
            </p>
          </div>
          {trip.driver_routine.note && (
            <div className="py-2">
              <p className="text-sm font-normal text-gray">
                Nota del conductor
              </p>
              <p className="text-md text-justify font-medium leading-5">
                ✏️ {trip.driver_routine.note}
              </p>
            </div>
          )}
        </div>
        {/* Trip request */}
        <div className="w-full rounded-t-xl bg-white py-6 px-5 shadow-t-md">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <p className="text-sm font-normal">Tipo de viaje</p>
              <p className="text-xl font-bold">
                {trip?.driver_routine.is_recurrent ? 'Recurrente' : 'Único'}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-normal">Precio por asiento</p>
              <p className="text-xl font-bold">
                {/* TODO: price should come as a float */}
                {Number.parseFloat(trip.driver_routine.price).toLocaleString(
                  'es-ES',
                  {
                    style: 'currency',
                    currency: 'EUR',
                  }
                )}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-normal">Plazas ocupadas</p>
              <p className="text-xl font-bold">
                {trip.passengers.length} de{' '}
                {trip.driver_routine.available_seats}
              </p>
            </div>
          </div>
          {!iAmTheDriver && !alreadyRequestedTrip && (
            <div className="flex justify-center">
              <Link
                href={NEXT_ROUTES.TRIP_PAYMENT(tripId)}
                className="flex w-full justify-center"
              >
                <CTAButton
                  className="mt-4 w-full"
                  text="SOLICITAR"
                  onClick={() => router.push(NEXT_ROUTES.TRIP_PAYMENT(tripId))}
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </AnimatedLayout>
  );
}
