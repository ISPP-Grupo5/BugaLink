import fetcher from '@/utils/fetcher';
import useSWR from 'swr';

export default function usePassengerRoutines(userId) {
  const { data, error, isLoading } = useSWR(
    `/users/${userId}/passenger-routines`,
    fetcher
  );

  const routines = data ? Object.values(data.passenger_routines) : undefined;

  // In each routine, add "type": "passenger" to the object so we can show
  // them differently in the UI (green and blue bands).
  // TODO: this would ideally come from the backend
  if (routines)
    routines.forEach((routine: any) => (routine.type = 'passenger'));

  return {
    routines,
    isLoading,
    isError: error,
  };
}
