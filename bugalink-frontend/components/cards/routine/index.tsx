import { ThreeDotsMenu } from '@/components/buttons/ThreeDots';
import Entry from '@/components/cards/common/entry';
import { MenuItem } from '@mui/material';
import MapPin from '/public/assets/map-pin.svg';
import OrigenPin from '/public/assets/origen-pin.svg';
import SteeringWheel from '/public/assets/steering-wheel.svg';

export default function RoutineCard({
  departureHourStart,
  departureHourEnd,
  type,
  origin,
  destination,
}) {
  const isDriver = type === 'driver';

  return (
    <span className="flex w-full rounded-lg border border-border-color">
      <div
        className={`min-h-full w-2.5 rounded-l-lg ${
          isDriver ? 'bg-green' : 'bg-turquoise'
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
            <p>Editar</p>
          </MenuItem>
          <MenuItem>
            <p className="text-red">Eliminar</p>
          </MenuItem>
        </ThreeDotsMenu>
      </div>
    </span>
  );
}
