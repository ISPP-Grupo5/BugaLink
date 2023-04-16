import { ThreeDotsMenu } from '@/components/buttons/ThreeDots';
import Entry from '@/components/cards/common/entry';
import { axiosAuth } from '@/lib/axios';
import { MenuItem } from '@mui/material';
import { useState } from 'react';
import MapPin from '/public/assets/map-pin.svg';
import OrigenPin from '/public/assets/origen-pin.svg';
import SteeringWheel from '/public/assets/steering-wheel.svg';
import NEXT_ROUTES from '@/constants/nextRoutes';
import Link from 'next/link';

type Props = {
  id: number;
  departureHourStart: string;
  departureHourEnd: string;
  type: 'driverRoutine' | 'passengerRoutine';
  origin: string;
  destination: string;
};

export default function RoutineCard({
  id,
  departureHourStart,
  departureHourEnd,
  type,
  origin,
  destination,
}: Props) {
  const isDriver = type === 'driverRoutine';
  const [isDeleted, setIsDeleted] = useState(false);
  const editLink = isDriver
    ? NEXT_ROUTES.NEW_ROUTINE_DRIVER
    : NEXT_ROUTES.NEW_ROUTINE_PASSENGER;

  async function deleteRoutine() {
    const url = isDriver ? 'driver-routines' : 'passenger-routines';
    try {
      await axiosAuth.delete(`${url}/${id}`);
      //TODO Recargar tarjetas de manera correcta en un futuro
      setIsDeleted(true);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  if (isDeleted) {
    return <></>;
  }
  return (
    <span className="flex w-full rounded-lg border border-border-color">
      <div
        className={`min-h-full w-2.5 rounded-l-lg ${
          isDriver ? 'bg-green' : 'bg-turquoise'
        }`}
      />
      <div className="relative grid w-full grid-cols-2 grid-rows-2 gap-2.5 p-1.5 pb-0">
        <Entry title={'Hora de salida'}>
          🕓️{' '}
          {new Date(departureHourStart).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          })}{' '}
          —{' '}
          {new Date(departureHourEnd).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Entry>
        <Entry title="Rol">
          {isDriver ? (
            <p className="flex items-center">
              <SteeringWheel className="mr-1 h-min w-3 flex-none" />
              Conductor
            </p>
          ) : (
            <p>🚗 Pasajero</p>
          )}
        </Entry>
        <Entry title="Origen">
          <OrigenPin
            className={`aspect-square flex-none opacity-70 ${
              isDriver ? 'text-green' : 'text-turquoise'
            }`}
          />
          <p className="truncate">{origin}</p>
        </Entry>
        <Entry title="Destino">
          <MapPin
            className={`aspect-square flex-none opacity-70 ${
              isDriver ? 'text-green' : 'text-turquoise'
            }`}
          />
          <p className="truncate">{destination}</p>
        </Entry>
        <ThreeDotsMenu>
          <MenuItem>
            <Link href={`${editLink}?id=${id}`}>
              <p>Editar</p>
            </Link>
          </MenuItem>
          <MenuItem onClick={deleteRoutine}>
            <p className="text-red">Eliminar</p>
          </MenuItem>
        </ThreeDotsMenu>
      </div>
    </span>
  );
}
