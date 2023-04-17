import PassengerRoutineI from '@/interfaces/passengerRoutine';
import { axiosAuth } from '@/lib/axios';
import { useEffect, useState } from 'react';

export default function usePassengerRoutines(id: string | number | undefined) {
  const [passengerRoutines, setPassengerRoutines] =
    useState<PassengerRoutineI>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchDriverRoutines = async () => {
      try {
        const response = await axiosAuth.get(`/passenger-routines/${id}`);
        const { data } = response;
        setPassengerRoutines(data);
        setIsLoading(false);
      } catch (error) {
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchDriverRoutines();
  }, [id]);

  return {
    passengerRoutines,
    isLoadingPassengerRoutines: isLoading,
    isErrorPassengerRoutines: isError,
  };
}
