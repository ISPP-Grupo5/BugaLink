import { ThreeDotsMenu } from '@/components/buttons/ThreeDots';
import Entry from '@/components/cards/common/entry';
import { MenuItem } from '@mui/material';
import MapPin from '/public/assets/map-pin.svg';
import OrigenPin from '/public/assets/origen-pin.svg';
import SteeringWheel from '/public/assets/steering-wheel.svg';
import { axiosAuth } from '@/lib/axios';
import { mutate } from 'swr';
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';
import { useState } from 'react';

export default function RoutineCard({
  id,
  departureHourStart,
  departureHourEnd,
  type,
  origin,
  destination,
}) {
  const isDriver = type === 'driverRoutine';
  const { data, status } = useSession();
  const user = data?.user as User;
  const [isDeleted, setIsDeleted] = useState(false)

  function deleteRoutine() {

    if (isDriver) {
      axiosAuth.delete(`driver-routines/${id}`)
        .then(response => {
          console.log('Data:', response.data);
          //TODO Recargar tarjetas de manera correcta en un futuro
          setIsDeleted(true);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      axiosAuth.delete(`passenger-routines/${id}`)
        .then(response => {
          console.log('Data:', response.data);
          //TODO Recargar tarjetas de manera correcta en un futuro
          setIsDeleted(true);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }

  }
  if (isDeleted) {
    return (<></>);
  }
  return (
    <span className="flex w-full rounded-lg border border-border-color">
      <div
        className={`min-h-full w-2.5 rounded-l-lg ${isDriver ? 'bg-green' : 'bg-turquoise'
          }`}
      />
      <div className="relative grid w-full grid-cols-2 grid-rows-2 gap-2.5 p-1.5 pb-0">
        <Entry title={'Hora de salida'}>
          🕓️ {departureHourStart} — {departureHourEnd}
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
            className={`aspect-square flex-none opacity-70 ${isDriver ? 'text-green' : 'text-turquoise'
              }`}
          />
          <p className="truncate">{origin}</p>
        </Entry>
        <Entry title="Destino">
          <MapPin
            className={`aspect-square flex-none opacity-70 ${isDriver ? 'text-green' : 'text-turquoise'
              }`}
          />
          <p className="truncate">{destination}</p>
        </Entry>
        <ThreeDotsMenu>
          <MenuItem>
            <p>Editar</p>
          </MenuItem>
          <MenuItem onClick={deleteRoutine}>
            <p className="text-red">Eliminar</p>
          </MenuItem>
        </ThreeDotsMenu>
      </div>
    </span>
  );
}
