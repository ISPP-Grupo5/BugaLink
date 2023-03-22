import { BackButtonText } from '@/components/buttons/Back';
import RoutineCard from '@/components/cards/routine';
import AnimatedLayout from '@/components/layouts/animated';
import RoutineCardSkeleton from '@/components/skeletons/Routine';
import useRoutines from '@/hooks/useRoutines';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import { useState } from 'react';

const WEEK_DAYS = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

export default function MyRoutines() {
  const { routines, isLoading, isError } = useRoutines();

  return (
    <AnimatedLayout className="flex flex-col bg-white">
      <BackButtonText text={'Mi horario'} />
      <div className="flex flex-col overflow-y-scroll px-6">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="mb-4 space-y-2">
            <h1 className="text-2xl">{day}</h1>
            {isLoading || isError
              ? [1, 2].map((i) => <RoutineCardSkeleton key={i} />)
              : routines
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
            {routines &&
              routines.filter((routine) => routine.day === day).length ===
                0 && (
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
