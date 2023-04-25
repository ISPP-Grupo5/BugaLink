import ProfileHeader from '@/components/ProfileHeader';
import TripDetails from '@/components/TripDetails';
import { BackButtonText } from '@/components/buttons/Back';
import CTAButton from '@/components/buttons/CTA';
import TextAreaField from '@/components/forms/TextAreaField';
import AnimatedLayout from '@/components/layouts/animated';
import MapPreview from '@/components/maps/mapPreview';
import NEXT_ROUTES from '@/constants/nextRoutes';
import useTripRequest from '@/hooks/useTripRequest';
import useUserStats from '@/hooks/useUserStats';
import { axiosAuth } from '@/lib/axios';
import { capitalize } from '@/utils/formatters';
import { Drawer } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useTrip from '@/hooks/useTrip';
import DialogConfirmation from '@/components/dialogs/confirmation';

export default function AcceptRequest() {
  const router = useRouter();
  const id = router.query.id as string;

  const [time, setTime] = useState<number>(0);
  const [drawerDecline, setDrawerDecline] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const { tripRequest, isLoading, isError } = useTripRequest(id);
  const { userStats, isLoadingStats, isErrorStats } = useUserStats(
    tripRequest?.passenger
  );
  const { trip } = useTrip(tripRequest?.trip.id);

  const occupiedSeats = trip?.passengers.length;
  const freeSeats = trip?.driver_routine.available_seats - occupiedSeats;

  const [openConfirmation, setOpenConfirmation] = useState(false);

  const onCloseDialogConfirmation = () => {
    setOpenConfirmation(false);
    router.push(NEXT_ROUTES.HOME);
  };

  const handleAcceptTripRequest = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      const response = await axiosAuth.put(`/trip-requests/${id}/accept/`);
      if (response.status === 200) setOpenConfirmation(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejectTripRequest = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      const response = await axiosAuth.put(`/trip-requests/${id}/reject/`, {
        reject_note: rejectNote,
      });
      if (response.status === 200) setOpenConfirmation(true);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading || isLoadingStats) return <p>Loading...</p>; // TODO: make skeleton
  if (isError || isErrorStats) return <p>Error</p>; // TODO: make error message

  // salida a las 21:00 y llegada a las 21:00 mas el tiempo de viaje
  const startTime = new Date(tripRequest.trip.departure_datetime);
  const endTime = new Date(tripRequest.trip.arrival_datetime);
  endTime.setMinutes(endTime.getMinutes() + time);

  const { origin, destination } = tripRequest.trip.driver_routine;

  return (
    <AnimatedLayout className="justify-between flex flex-col">
      <BackButtonText text="Solicitud de viaje" />
      <div className="justify-between flex h-full flex-col overflow-y-scroll bg-white px-6 pb-4 pt-2">
        <ProfileHeader user={userStats} />
        <p className="mt-4 text-justify text-sm font-normal text-dark-gray">
          Nota del pasajero
        </p>
        <div className="flex flex-row">
          <p className="text-justify leading-5">✏️ {tripRequest.note}</p>
        </div>

        {/* Details */}
        <div className="py-2">
          <hr className="mt-3 mb-3 w-full text-border-color" />
          <p className="text-xl font-bold">Detalles del viaje</p>
        </div>
        {/* Map preview */}
        {origin && destination && (
          <MapPreview
            tripId={tripRequest.trip.id}
            originCoords={{ lat: origin.latitude, lng: origin.longitude }}
            destinationCoords={{
              lat: destination.latitude,
              lng: destination.longitude,
            }}
            setTime={setTime}
            className="h-full min-h-[10rem]"
          />
        )}
        <TripDetails
          date={capitalize(
            startTime.toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          )}
          originHour={startTime.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          destinationHour={endTime.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          origin={origin.address}
          destination={destination.address}
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
                  content={rejectNote}
                  setContent={setRejectNote}
                  inputClassName="w-full items-center"
                  maxLength={1000}
                  rows={5}
                />
              </div>
              <div className="mb-5 flex flex-col items-center">
                <CTAButton
                  className="w-11/12 bg-red-button"
                  text={'RECHAZAR'}
                  onClick={handleRejectTripRequest}
                />
              </div>
            </div>
          </Drawer>
        </div>
        {freeSeats > 0 ? (
          <CTAButton
            className="w-11/12"
            text={'ACEPTAR'}
            onClick={handleAcceptTripRequest}
          />
        ) : (
          <CTAButton className="w-11/12" text={'El viaje está lleno'} />
        )}
      </div>
      <DialogConfirmation
        open={openConfirmation}
        setOpen={setOpenConfirmation}
        onClose={onCloseDialogConfirmation}
      />
    </AnimatedLayout>
  );
}
