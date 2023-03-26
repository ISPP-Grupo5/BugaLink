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
import { GetServerSideProps } from 'next';
import useRideDetails from '@/hooks/useRideDetails';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  const data = {
    id: id,
  }

  return {
    props: { data },
  };
};





export default function AcceptRequest({data}) {
  const [time, setTime] = useState<number>(0);
  const [drawerDecline, setDrawerDecline] = useState(false);
  const [reason, setReason] = useState('');
  const [origin, setOrigin] = useState();
  const [destination, setDestination] = useState();
  const originCoords = useMapCoordinates(origin);
  const destinationCoords = useMapCoordinates(destination);
  const individualRide_id = data.id;
  const { individualRide, isLoading, isError } = useIndividualRides(individualRide_id);
  let passengerId = individualRide? individualRide.passenger : 'Loading...';
  let rideId = individualRide? individualRide.ride : 'Loading...';
  const { reviews, isLoadingReviews, isErrorReviews } = useReviews(passengerId);
  const { rideData } = useRideDetails(rideId);

  useEffect(() => {
    if (rideData) {
      setOrigin(rideData.ride.start_location);
      console.log(rideData.ride.start_location)
      setDestination(rideData.ride.end_location);
    }
  }, [rideData]);

  if (isLoading || isLoadingReviews) return <p>Loading...</p>; // TODO: make skeleton
  if (isError || isErrorReviews) return <p>Error</p>; // TODO: make error message

  
  const dateText = `Cada ${rideData ? rideData.day : ''} a partir del ${rideData ? rideData.ride.start_date.substr(0, 10) : ''}`;

  // salida a las 21:00 y llegada a las 21:00 mas el tiempo de viaje
  let startTime = rideData ? rideData.start_time_0 : 'Loading...';
  startTime = startTime.substr(0, 8);

  let endTime = rideData ? rideData.ride.end_date : 'Loading...';
  
  

  return (
    <AnimatedLayout className="flex flex-col justify-between">
      <BackButtonText text="Solicitud de viaje" />
      <div className="flex h-full flex-col justify-between overflow-y-scroll bg-white px-6 pb-4 pt-2">
        {/* Profile header */}
        <ProfileHeader
          name={reviews.username}
          rating={reviews.rating}
          numberOfRatings={reviews.total_ratings}
          photo={reviews.profile_photo ? reviews.profile_photo : '/assets/avatar.png'}
          id = {passengerId}
        />
        <p className="mt-4 text-justify text-sm font-normal text-dark-gray">
          Nota del pasajero
        </p>
        <div className="flex flex-row">
          <p className="text-justify leading-5">✏️ {individualRide.passenger_note ? individualRide.passenger_note : "No hay ningún comentario"}</p>
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
          originHour={startTime}
          destinationHour={endTime.substr(11,12)}
          origin={origin}
          destination={destination}
        />
      </div>
      {/* Trip request */}
      <div className="shadossw-t-md z-50 flex w-full flex-col items-center justify-between rounded-t-lg bg-white py-6 px-4">
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

