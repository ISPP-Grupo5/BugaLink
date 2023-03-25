import fetcher from '@/utils/fetcher';
import useSWR from 'swr';

export default function usePassengerRoutines(user_id) {
  const { data, error, isLoading } = useSWR(
    `/users/${user_id}/passenger-routines`,
    fetcher
  );

  return {
    routines: data,
    isLoading,
    isError: error,
  };
}