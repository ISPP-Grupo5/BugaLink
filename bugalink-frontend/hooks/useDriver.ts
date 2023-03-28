import fetcher from '@/utils/fetcher';
import useSWR from 'swr';

export default function useDriver(driverId) {
  const { data, error, isLoading } = useSWR(`/drivers/${driverId}`, fetcher);

  return {
    driver: data,
    isLoading,
    isError: error,
  };
}
