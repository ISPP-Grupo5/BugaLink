import fetcher from '@/utils/fetcher';
import useSWR from 'swr';

export default function useDriverRoutines(user_id) {
  const { data, error, isLoading } = useSWR(
    `/users/${user_id}/driver-routines`,
    fetcher
  );

  const routines = data ? Object.values(data.driver_routines) : undefined;
  if (routines) routines.forEach((routine: any) => (routine.type = 'driver'));

  return {
    routines,
    isLoading,
    isError: error,
  };
}
