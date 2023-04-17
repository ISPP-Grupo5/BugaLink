import DriverRoutineI from '@/interfaces/driverRoutine';
import { axiosAuth } from '@/lib/axios';
import { useEffect, useState } from 'react';

export default function useDriverRoutines(id: string | number | undefined) {
  const [driverRoutines, setDriverRoutines] = useState<DriverRoutineI>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchDriverRoutines = async () => {
      try {
        const response = await axiosAuth.get(`/driver-routines/${id}`);
        const { data } = response;
        setDriverRoutines(data);
        setIsLoading(false);
      } catch (error) {
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchDriverRoutines();
  }, [id]);

  return {
    driverRoutines,
    isLoadingDriverRoutines: isLoading,
    isErrorDriverRoutines: isError,
  };
}
