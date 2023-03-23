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
import useDriverRoutines from '@/hooks/useDriverRoutines';
import { GetServerSideProps } from 'next';
import usePassengerRoutines from '@/hooks/usePassengerRoutines';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  const data = {
    id: id,
  }

  return {
    props: { data },
  };
};

export default function MyRoutines({ data }) {
  const days = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];

  const userId = data.id;
  
  const{ routines: passengerRoutines = [], isLoading: isLoadingPassenger, isError: isErrorPassenger } = usePassengerRoutines(userId);
  const { routines: driverRoutines = [], isLoading: isLoadingDriver, isError: isErrorDriver } = useDriverRoutines(userId);
  
  
  // const [isLoading, setIsLoading] = useState(true);

  const routines = [];
  if(!isLoadingDriver&&!isLoadingPassenger){
    console.log(passengerRoutines);
    console.log(driverRoutines);
    routines.push(...passengerRoutines['passenger_routines'], ...driverRoutines['driver_routines']);
    console.log(routines);
    // setIsLoading(false);
  }

  if (isLoadingPassenger && isLoadingDriver) return <div>Loading...</div>;
  if (isErrorPassenger && isErrorDriver) return <div>Error</div>;
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
 