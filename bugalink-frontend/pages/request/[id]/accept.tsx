import useIndividualRides from '@/hooks/useIndividualRides';
import useReviews from '@/hooks/useReviews';
import { BackButtonText } from '@/components/buttons/Back';
import CTAButton from '@/components/buttons/CTA';
import TextAreaField from '@/components/forms/TextAreaField';
import AnimatedLayout from '@/components/layouts/animated';
import MapPreview from '@/components/maps/mapPreview';
import ProfileHeader from '@/components/ProfileHeader';
import TripDetails from '@/components/TripDetails';
import useMapCoordinates from '@/hooks/useMapCoordinates';
import { Drawer } from '@mui/material';
import { useEffect, useState } from 'react';

export default function AcceptRequest() {
  const [time, setTime] = useState<number>(0);
  const [drawerDecline, setDrawerDecline] = useState(false);
  const [reason, setReason] = useState('');
  const { individualRide, isLoading, isError } = useIndividualRides(2);
  const [origin, setOrigin] = useState();
  const [destination, setDestination] = useState();
  const originCoords = useMapCoordinates(origin);
  const destinationCoords = useMapCoordinates(destination);
  const { reviews, isLoadingReviews, isErrorReviews } = useReviews(1);

  useEffect(() => {
    if (individualRide && individualRide.length > 0) {
      setOrigin(individualRide[0].start_location);
      setDestination(individualRide[0].end_location);
    }
  }, [individualRide]);

  if (isLoading || isLoadingReviews) return <p>Loading...</p>; // TODO: make skeleton
  if (isError || isErrorReviews) return <p>Error</p>; // TODO: make error message

  const ride = individualRide[0];
  const dateText = `Cada ${ride.passenger_routine.days} a partir del ${ride.start_date}`;

  let sum = 0;
  for (const element of reviews) {
    sum += element.rating;
  }
  const meanReviews = (sum / reviews.length).toFixed(2);
  // salida a las 21:00 y llegada a las 21:00 mas el tiempo de viaje
  const startTime = new Date(ride.passenger_routine.start_time_initial);
  const endTime = new Date(ride.passenger_routine.start_time_initial);
  endTime.setMinutes(endTime.getMinutes() + time);

  return (
    <AnimatedLayout className="justify-between flex flex-col">
      <BackButtonText text="Solicitud de viaje" />
      <div className="justify-between flex h-full flex-col overflow-y-scroll bg-white px-6 pb-4 pt-2">
        {/* Profile header */}
        <ProfileHeader
          name={ride.passenger.user.username}
          rating={meanReviews.toString()}
          numberOfRatings={reviews.length}
          photo={ride.passenger.user.photo}
        />
        <p className="mt-4 text-justify text-sm font-normal text-dark-gray">
          Nota del pasajero
        </p>
        <div className="flex flex-row">
          <p className="text-justify leading-5">✏️ {ride.message}</p>
        </div>

        {/* Details */}
        <div className="py-2">
          <hr className="mt-3 mb-3 w-full text-border-color" />
          <p className="text-xl font-bold">Detalles del viaje</p>
        </div>
        {/* Map preview */}
        {origin && destination && (
          <MapPreview
            originCoords={originCoords.coordinates}
            destinationCoords={destinationCoords.coordinates}
            setTime={setTime}
            className="h-full min-h-[10rem]"
          />
        )}
        <TripDetails
          date={dateText}
          originHour={startTime.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          destinationHour={endTime.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          origin={origin}
          destination={destination}
        />
      </div>
      {/* Trip request */}
      <div className="shadossw-t-md justify-between z-50 flex w-full flex-col items-center rounded-t-lg bg-white py-6 px-4">
        <div className="flex flex-row pb-3">
          <p
            className="text-md cursor-pointer font-medium text-red-dark"
            onClick={() => setDrawerDecline(true)}
          >
            No puedo llevar a este pasajero
          </p>
          <Drawer
            anchor="bottom"
            open={drawerDecline}
            onClose={() => setDrawerDecline(false)}
            SlideProps={{
              style: {
                minWidth: '320px',
                maxWidth: '480px',
                width: '100%',
                margin: '0 auto',
                backgroundColor: 'transparent',
              },
            }}
          >
            <div className="overflow-visible rounded-t-lg bg-white">
              <div className="m-5 flex">
                <p className="font-lato text-xl font-bold">
                  Motivo del rechazo
                </p>
              </div>
              <div className="mx-5 mb-2 flex flex-col">
                <TextAreaField
                  fieldName="Resume brevemente el motivo"
                  content={reason}
                  setContent={setReason}
                  inputClassName="w-full items-center"
                  maxLength={1000}
                  rows={5}
                />
              </div>
              <div className="mb-5 flex flex-col items-center">
                <CTAButton
                  className="w-11/12 bg-red-button"
                  text={'RECHAZAR'}
                />
              </div>
            </div>
          </Drawer>
        </div>
        <CTAButton className="w-11/12" text={'ACEPTAR'} />
      </div>
    </AnimatedLayout>
  );
}
