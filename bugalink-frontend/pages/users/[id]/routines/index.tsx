import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { BackButtonText } from '@/components/buttons/Back';
import Entry from '@/components/cards/common/entry';
import AnimatedLayout from '@/components/layouts/animated';
import MapPin from '/public/assets/map-pin.svg';
import OrigenPin from '/public/assets/origen-pin.svg';
import ThreeDots from '/public/assets/three-dots.svg';
import SteeringWheel from '/public/assets/steering-wheel.svg';
import Link from 'next/link';

const routines = [
  {
    id: 1,
    departureHourStart: '8:00',
    departureHourEnd: '8:15',
    type: 'driver',
    origin: 'Centro comercial Way, Dos Hermanas, Sevilla, 41702',
    destination: 'Centro comercial Lagoh, Sevilla, 41007',
    day: 'Lunes',
  },
  {
    id: 2,
    departureHourStart: '13:30',
    departureHourEnd: '8:40',
    type: 'passenger',
    origin: 'Centro comercial Way, Dos Hermanas, Sevilla, 41702',
    destination: 'Centro comercial Lagoh, Sevilla, 41007',
    day: 'Jueves',
  },
  {
    id: 3,
    departureHourStart: '15:00',
    departureHourEnd: '15:15',
    type: 'driver',
    origin: 'Centro comercial Way, Dos Hermanas, Sevilla, 41702',
    destination: 'Centro comercial Lagoh, Sevilla, 41007',
    day: 'Martes',
  },
  {
    id: 4,
    departureHourStart: '18:00',
    departureHourEnd: '18:15',
    type: 'passenger',
    origin: 'Centro comercial Way, Dos Hermanas, Sevilla, 41702',
    destination: 'Centro comercial Lagoh, Sevilla, 41007',
    day: 'Domingo',
  },
  {
    id: 5,
    departureHourStart: '20:00',
    departureHourEnd: '20:15',
    type: 'passenger',
    origin: 'Centro comercial Way, Dos Hermanas, Sevilla, 41702',
    destination: 'Centro comercial Lagoh, Sevilla, 41007',
    day: 'Domingo',
  },
];

export default function MyRoutines() {
  const days = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];
  return (
    <AnimatedLayout className="flex flex-col bg-white">
      <BackButtonText text={'Mi horario'} />
      <div className="flex flex-col overflow-y-scroll px-6">
        {days.map((day) => (
          <div key={day} className="mb-4 space-y-2">
            <h1 className="text-2xl">{day}</h1>
            {routines
              .filter((routine) => routine.day === day)
              .map((routine) => (
                <RoutineCard
                  key={routine.id}
                  departureHourStart={routine.departureHourStart}
                  departureHourEnd={routine.departureHourEnd}
                  type={routine.type}
                  origin={routine.origin}
                  destination={routine.destination}
                />
              ))}
            {routines.filter((routine) => routine.day === day).length === 0 && (
              <div className="w-full rounded-md border border-border-color py-2 text-center font-light text-gray">
                No tienes horario para este día
              </div>
            )}
          </div>
        ))}
      </div>
      <AddRoutineMenu />
    </AnimatedLayout>
  );
}

const RoutineCard = ({
  departureHourStart,
  departureHourEnd,
  type,
  origin,
  destination,
}) => {
  const isDriver = type === 'driver';

  return (
    <span className="flex w-full rounded-lg border border-border-color">
      <div
        className={`' + min-h-full w-2.5 rounded-l-lg ${
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
};

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

const AddRoutineMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="absolute bottom-0 right-0 mb-8 mr-8">
      <button
        className="flex aspect-square w-14 items-center justify-center rounded-full bg-dark-turquoise text-2xl text-white"
        onClick={handleClick}
      >
        +
      </button>
      <Menu
        transformOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <Link href="/users/273932t8437/routines/passenger/new">
          <MenuItem onClick={handleClose}>Como pasajero</MenuItem>
        </Link>
        <Link href="/users/273932t8437/routines/driver/new">
          <MenuItem onClick={handleClose}>Como conductor</MenuItem>
        </Link>
      </Menu>
    </div>
  );
};
