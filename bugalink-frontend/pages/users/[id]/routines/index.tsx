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
  
  const daysComparator = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun',
  ];

  const dayDictionary = {
    Mon: 'Lunes',
    Tue: 'Martes',
    Wed: 'Miércoles',
    Thu: 'Jueves',
    Fri: 'Viernes',
    Sat: 'Sábado',
    Sun: 'Domingo',
  };

  const user_id = data.id;
  
  const{ routines: passengerRoutines = [], isLoading: isLoadingPassenger, isError: isErrorPassenger } = usePassengerRoutines(user_id);
  const { routines: driverRoutines = [], isLoading: isLoadingDriver, isError: isErrorDriver } = useDriverRoutines(user_id);
  
  const routines = [];
  
  if(!isLoadingDriver&&!isLoadingPassenger){
    passengerRoutines['passenger_routines'] && routines.push(...passengerRoutines['passenger_routines']);
    driverRoutines['driver_routines'] && routines.push(...driverRoutines['driver_routines']);
  }

  if (isLoadingPassenger && isLoadingDriver) return <div>Loading...</div>;
  if (isErrorPassenger && isErrorDriver) return <div>Error</div>;
  return (
    <AnimatedLayout className="flex flex-col bg-white">
      <BackButtonText text={'Mi horario'} />
      <div className="flex flex-col overflow-y-scroll px-6">
        {daysComparator.map((dayComp) => (
          <div key={dayComp} className="mb-4 space-y-2">
            <h1 className="text-2xl">{dayDictionary[dayComp]}</h1>
            {routines
              .filter((routine) => routine.day === dayComp)
              .map((rou) => (
                <RoutineCard
                  key={rou.id}
                  departureHourStart={rou.start_time_initial||rou.start_date_0}
                  departureHourEnd={rou.start_time_final||rou.start_date_1}
                  type={rou.passenger? 1:2}
                  origin={rou.start_location}
                  destination={rou.end_location}
                />
              ))}
            {routines.filter((routine) => routine.day === dayComp).length === 0 && (
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
  const isDriver = type === 2;
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
        data-cy="add-routine-menu"
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
        <Link
          data-cy="new-passenger-routine"
          href="/users/273932t8437/routines/passenger/new"
        >
          <MenuItem onClick={handleClose}>Como pasajero</MenuItem>
        </Link>
        <Link
          data-cy="new-driver-routine"
          href="/users/273932t8437/routines/driver/new"
        >
          <MenuItem onClick={handleClose}>Como conductor</MenuItem>
        </Link>
      </Menu>
    </div>
  );
};
