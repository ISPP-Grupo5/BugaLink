import fetcher from '@/utils/fetcher';
import useSWR from 'swr';

export default function useDriverRoutines(user_id) {
  const { data, error, isLoading } = useSWR(
    `/users/${user_id}/driver-routines`,
    fetcher
  );

  return {
    routines: data,
    isLoading,
    isError: error,
  };
}