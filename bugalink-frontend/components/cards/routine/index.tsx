import Entry from '@/components/cards/common/entry';
import { Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import MapPin from '/public/assets/map-pin.svg';
import OrigenPin from '/public/assets/origen-pin.svg';
import SteeringWheel from '/public/assets/steering-wheel.svg';
import ThreeDots from '/public/assets/three-dots.svg';

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
        <ThreeDotsMenu />
      </div>
    </span>
  );
}

const ThreeDotsMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <ThreeDots
        className="absolute top-5 right-1 h-4 cursor-pointer"
        aria-label="more"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      />
      <Menu
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>
          <p>Editar</p>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <p className="text-red">Eliminar</p>
        </MenuItem>
      </Menu>
    </div>
  );
};
