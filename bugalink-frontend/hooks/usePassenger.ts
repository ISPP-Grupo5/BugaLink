import fetcher from '@/utils/fetcher';
import useSWR from 'swr';

export default function usePassenger(passengerId) {
  const { data, error, isLoading } = useSWR(
    `/passengers/${passengerId}`,
    fetcher
  );

  return {
    passenger: data,
    isLoading,
    isError: error,
  };
}
