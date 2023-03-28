import { BackButtonText } from '@/components/buttons/Back';
import RoutineCard from '@/components/cards/routine';
import AnimatedLayout from '@/components/layouts/animated';
import RoutineCardSkeleton from '@/components/skeletons/Routine';
import useDriver from '@/hooks/useDriver';
import usePassenger from '@/hooks/usePassenger';
import DriverRoutineI from '@/interfaces/driverRoutine';
import GenericRoutineI from '@/interfaces/genericRoutine';
import PassengerRoutineI from '@/interfaces/passengerRoutine';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';

const WEEK_DAYS = {
  '0': 'Lunes',
  '1': 'Martes',
  '2': 'Miércoles',
  '3': 'Jueves',
  '4': 'Viernes',
  '5': 'Sábado',
  '6': 'Domingo',
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return { props: { data: { id: query.id } } };
};

const mergeRoutines = (
  passengerRoutines: PassengerRoutineI[],
  driverRoutines: DriverRoutineI[]
): GenericRoutineI[] => {
  const allRoutines = [];

  // Iterate over each passenger routine
  for (const routine of [...passengerRoutines, ...driverRoutines]) {
    // We add a card for each day of the week the routine is repeated
    for (const day of routine.days_of_week) {
      allRoutines.push({
        id: routine.id,
        origin: routine.origin,
        destination: routine.destination,
        day: day.toString(),
        departure_time_start: routine.departure_time_start.substring(0, 5), // 18:00:00 -> 18:00
        departure_time_end: routine.departure_time_end.substring(0, 5), // 18:00:00 -> 18:00
        // Ugly hack to determine if the routine is a passenger or driver routine
        // We take advantage of the fact that days_of_week is an array of numbers
        // for passenger routines and an array of strings for driver routines
        // which has to be fixed anyways
        type:
          typeof routine.days_of_week[0] === 'number'
            ? 'passengerRoutine'
            : 'driverRoutine',
      });
    }
  }
  return allRoutines;
};

export default function MyRoutines({ data }) {
  const userId = data.id;
  const passengerId = 1; // TODO: get this from the user's session
  const driverId = 1; // TODO: get this from the user's session

  const {
    passenger,
    isLoading: isLoadingPassenger,
    isError: isErrorPassenger,
  } = usePassenger(passengerId);

  const {
    driver,
    isLoading: isLoadingDriver,
    isError: isErrorDriver,
  } = useDriver(driverId);

  const isLoading = isLoadingPassenger || isLoadingDriver;
  const isError = isErrorPassenger || isErrorDriver;

  const passengerRoutines = passenger?.routines || [];
  const driverRoutines = driver?.routines || [];

  const allRoutines = mergeRoutines(passengerRoutines, driverRoutines);

  return (
    <AnimatedLayout className="flex flex-col bg-white">
      <BackButtonText text={'Mi horario'} />
      <div className="flex flex-col overflow-y-scroll px-6">
        {Object.keys(WEEK_DAYS).map((day) => (
          <div key={day} className="mb-4 space-y-2">
            <h1 className="text-2xl">{WEEK_DAYS[day]}</h1>
            {isLoading || isError
              ? [1, 2].map((id) => <RoutineCardSkeleton key={id} />)
              : allRoutines
                  .filter((routine: GenericRoutineI) => routine.day === day)
                  .map((routine: GenericRoutineI) => (
                    <RoutineCard
                      key={routine.id + routine.origin.address}
                      departureHourStart={routine.departure_time_start}
                      departureHourEnd={routine.departure_time_end}
                      // TODO: bad practice, use meaningful names instead of type 21 and type 2 (remeber DP1)
                      type={routine.type}
                      origin={routine.origin.address}
                      destination={routine.destination.address}
                    />
                  ))}
            {!isLoading &&
              !isError &&
              allRoutines.filter(
                (routine: GenericRoutineI) => routine.day === day
              ).length === 0 && (
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
