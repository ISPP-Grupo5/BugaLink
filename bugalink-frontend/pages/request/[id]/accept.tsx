import { BackButtonText } from '@/components/buttons/Back';
import CTAButton from '@/components/buttons/CTA';
import TextAreaField from '@/components/forms/TextAreaField';
import AnimatedLayout from '@/components/layouts/animated';
import MapPreview from '@/components/maps/mapPreview';
import ProfileHeader from '@/components/ProfileHeader';
import TripDetails from '@/components/TripDetails';
import useMapCoordinates from '@/hooks/useMapCoordinates';
import { Drawer } from '@mui/material';
import { useState } from 'react';

export default function AcceptRequest() {
  const origin =
    'Escuela Técnica Superior de Ingeniería Informática, 41002 Sevilla';
  const destination = 'Avenida de Andalucía, 35, Dos Hermanas, 41002 Sevilla';

  const [drawerDecline, setDrawerDecline] = useState(false);
  const [reason, setReason] = useState('');
  const [time, setTime] = useState<number>(0);
  const originCoords = useMapCoordinates(origin);
  const destinationCoords = useMapCoordinates(destination);

  // salida a las 21:00 y llegada a las 21:00 mas el tiempo de viaje
  const startTime = new Date('2021-05-01T21:00:00');
  const endTime = new Date('2021-05-01T21:00:00');
  endTime.setMinutes(endTime.getMinutes() + time);

  return (
    <AnimatedLayout className="flex flex-col justify-between">
      <BackButtonText text="Solicitud de viaje" />
      <div className="flex h-full flex-col justify-between overflow-y-scroll bg-white px-6 pb-4 pt-2">
        {/* Profile header */}
        <ProfileHeader
          name="Jesús Marchena"
          rating="4.8"
          numberOfRatings="14"
        />
        <p className="mt-4 text-justify text-sm font-normal text-dark-gray">
          Nota del pasajero
        </p>
        <div className="flex flex-row">
          <p className="text-justify leading-5">
            ✏️ Algunos días sueltos no haré el viaje, pero los cancelaré con un
            par de días de antelación para dejar el asiento libre a otros
            usuarios de la aplicación.
          </p>
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
          date="Cada viernes a partir del 16 de febrero de 2023"
          originHour={startTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
          destinationHour={endTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
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
