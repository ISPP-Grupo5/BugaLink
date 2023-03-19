import useIndividualRides from '@/hooks/useIndividualRides';
import useReviews from '@/hooks/useReviews';
import { Drawer } from '@mui/material';
import { useState } from 'react';
import { BackButtonText } from '../../../components/buttons/Back';
import CTAButton from '../../../components/buttons/CTA';
import TextAreaField from '../../../components/forms/TextAreaField';
import AnimatedLayout from '../../../components/layouts/animated';
import MapPreview from '../../../components/MapPreview';
import ProfileHeader from '../../../components/ProfileHeader';
import TripDetails from '../../../components/TripDetails';

export default function AcceptRequest() {
  const [drawerDecline, setDrawerDecline] = useState(false);
  const [reason, setReason] = useState('');
  const { individualRide, isLoading, isError } = useIndividualRides(1);
  const { reviews } = useReviews(1);
  if (isLoading) return <p>Loading...</p>; // TODO: make skeleton
  if (isError) return <p>Error</p>; // TODO: make error message
  let ride = individualRide[0];
  let dateText=`Cada ${ride.passenger_routine.days} a partir del ${ride.start_date}`;
  let sum = 0;
  for(let i= 0; i<reviews.length ; i++){
    sum+= reviews[i].rating;
  }

  const meanReviews = (sum / reviews.length).toFixed(2);
  console.log(ride)
  return (
    <AnimatedLayout className="flex flex-col justify-between">
      <BackButtonText text="Solicitud de viaje" />
      <div className="flex h-full flex-col justify-between overflow-y-scroll bg-white px-6 pb-4 pt-2">
        {/* Profile header */}
        <ProfileHeader
          name={ride.passenger.user.username}
          rating={meanReviews.toString()}
          numberOfRatings={reviews.length}
        />
        <div className="flex flex-row">
          <p className="text-justify text-sm font-normal text-dark-gray">
            Nota del pasajero
          </p>
        </div>
        <div className="flex flex-row">
          <p className="text-justify leading-5">
            ✏️ {ride.message}
          </p>
        </div>

        {/* Details */}
        <div className="mt-4 py-2">
          <hr className="mt-3 mb-3 w-full text-border-color" />
          <p className="text-xl font-bold">Detalles del viaje</p>
        </div>
        {/* Map preview */}
        <MapPreview />
        <TripDetails
          date={dateText}
          originHour={ride.passenger_routine.start_time_initial}
          destinationHour={ride.passenger_routine.start_time_final}
          origin="Escuela Técnica Superior de Ingeniería Informática (ETSII), 41002
          Sevilla"
          destination="Avenida de Andalucía, 35, Dos Hermanas, 41002 Sevilla"
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
