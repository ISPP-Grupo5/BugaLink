import fetcher from '@/utils/fetcher';
import useSWR from 'swr';

export default function useDriverRoutines(id) {
  const { data, error, isLoading } = useSWR(
    `/users/${id}/driver-routines`,
    fetcher
  );

  return {
    routines: data,
    isLoading,
    isError: error,
  };
}