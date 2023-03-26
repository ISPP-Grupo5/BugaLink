import { BackButtonText } from '@/components/buttons/Back';
import AnimatedLayout from '@/components/layouts/animated';
import RoutineCardSkeleton from '@/components/skeletons/Routine';
import useDriverRoutines from '@/hooks/useDriverRoutines';
import usePassengerRoutines from '@/hooks/usePassengerRoutines';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';

const WEEK_DAYS = {
  Mon: 'Lunes',
  Tue: 'Martes',
  Wed: 'Miércoles',
  Thu: 'Jueves',
  Fri: 'Viernes',
  Sat: 'Sábado',
  Sun: 'Domingo',
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return { props: { data: { id: query.id } } };
};

export default function MyRoutines({ data }) {
  const userId = data.id;

  const {
    routines: passengerRoutines = [],
    isLoading: isLoadingPassenger,
    isError: isErrorPassenger,
  } = usePassengerRoutines(userId);
  const {
    routines: driverRoutines = [],
    isLoading: isLoadingDriver,
    isError: isErrorDriver,
  } = useDriverRoutines(userId);

  const isLoading = isLoadingPassenger || isLoadingDriver;
  const isError = isErrorPassenger || isErrorDriver;

  // Show driver and passenger routines together on the screen
  const allRoutines = [...passengerRoutines, ...driverRoutines];

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
                  .filter((routine: any) => routine.day === day)
                  .map((routine: any) => (
                    <RoutineCard
                      key={routine.start_date_0 + routine.start_location}
                      departureHourStart={
                        routine.start_time_initial || routine.start_date_0
                      }
                      departureHourEnd={
                        routine.start_time_final || routine.start_date_1
                      }
                      // TODO: bad practice, use meaningful names instead of type 21 and type 2 (remeber DP1)
                      type={routine.type}
                      origin={routine.start_location}
                      destination={routine.end_location}
                    />
                  ))}
            {!isLoading &&
              !isError &&
              allRoutines.filter((routine: any) => routine.day === day)
                .length === 0 && (
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
