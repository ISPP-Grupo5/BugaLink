import fetcher from '@/utils/fetcher';
import useSWR from 'swr';

export default function useRoutine() {
  const USER_ID = 1;
  const { data, error, isLoading } = useSWR(
    `/users/${USER_ID}/routines`,
    fetcher
  );

  return {
    routines: data,
    isLoading,
    isError: error,
  };
}