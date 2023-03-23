import fetcher from '@/utils/fetcher';
import useSWR from 'swr';

export default function usePassengerRoutines(id) {
  const { data, error, isLoading } = useSWR(
    `/users/${id}/passenger-routines`,
    fetcher
  );

  return {
    routines: data,
    isLoading,
    isError: error,
  };
}