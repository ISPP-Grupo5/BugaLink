import { BackButtonText } from '@/components/buttons/Back';
import RoutineCard from '@/components/cards/routine';
import DialogComponent from '@/components/dialog';
import AnimatedLayout from '@/components/layouts/animated';
import RoutineCardSkeleton from '@/components/skeletons/Routine';
import NEXT_ROUTES from '@/constants/nextRoutes';
import { WEEK_DAYS } from '@/constants/weekDays';
import useDriver from '@/hooks/useDriver';
import usePassenger from '@/hooks/usePassenger';
import DriverRoutineI from '@/interfaces/driverRoutine';
import GenericRoutineI from '@/interfaces/genericRoutine';
import PassengerRoutineI from '@/interfaces/passengerRoutine';
import { parseDate } from '@/utils/formatters';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

const mergeRoutines = (
  passengerRoutines: PassengerRoutineI[],
  driverRoutines: DriverRoutineI[]
): GenericRoutineI[] => {
  const allRoutines = [];

  // Iterate over each passenger routine
  for (const routine of [...passengerRoutines, ...driverRoutines]) {
    // We add a card for each day of the week the routine is repeated
    allRoutines.push({
      id: routine.id,
      origin: routine.origin,
      destination: routine.destination,
      day_of_week: routine.day_of_week,
      departure_time_start: parseDate(routine.departure_time_start), // 18:00:00 -> 18:00
      departure_time_end: parseDate(routine.departure_time_end), // 18:00:00 -> 18:00
      type: routine.type,
    });
  }
  return allRoutines;
};

export default function MyRoutines() {
  const { data } = useSession();
  const user = data?.user as User;
  const {
    passenger,
    isLoading: passengerIsLoading,
    isError: passengerIsError,
  } = usePassenger(user?.passenger_id);
  const {
    driver,
    isLoading: driverIsLoading,
    isError: driverIsError,
  } = useDriver(user?.driver_id);

  const passengerRoutines = passenger?.routines || [];
  const driverRoutines = driver?.routines || [];
  const allRoutines = mergeRoutines(passengerRoutines, driverRoutines);

  const isLoading = passengerIsLoading || driverIsLoading;
  const isError = passengerIsError || driverIsError;

  const [openDialog, setOpenDialog] = useState(false);

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
                  .filter(
                    (routine: GenericRoutineI) => routine.day_of_week === day
                  )
                  .map((routine: GenericRoutineI) => (
                    <RoutineCard
                      key={routine.id + routine.origin.address}
                      id={routine.id}
                      departureHourStart={routine.departure_time_start}
                      departureHourEnd={routine.departure_time_end}
                      type={routine.type}
                      origin={routine.origin.address}
                      destination={routine.destination.address}
                      setOpenDialog={setOpenDialog}
                    />
                  ))}
            {!isLoading &&
              !isError &&
              allRoutines.filter(
                (routine: GenericRoutineI) => routine.day_of_week === day
              ).length === 0 && (
                <div className="w-full rounded-md border border-border-color py-2 text-center font-light text-gray">
                  No tienes horario para este día
                </div>
              )}
          </div>
        ))}
      </div>
      <AddRoutineMenu user={user} />
      <DialogComponent
        title="Rutina eliminada"
        description="La rutina se ha eliminado correctamente."
        onClose={() => setOpenDialog(false)}
        onCloseButton="Entendido"
        open={openDialog}
        setOpen={setOpenDialog}
      />
    </AnimatedLayout>
  );
}

const AddRoutineMenu = ({ user }: { user: User }) => {
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
          href={NEXT_ROUTES.NEW_ROUTINE_PASSENGER}
        >
          <MenuItem onClick={handleClose}>Como pasajero</MenuItem>
        </Link>
        {user?.is_validated_driver && (
          <Link
            data-cy="new-driver-routine"
            href={NEXT_ROUTES.NEW_ROUTINE_DRIVER}
          >
            <MenuItem onClick={handleClose}>Como conductor</MenuItem>
          </Link>
        )}
      </Menu>
    </div>
  );
};
