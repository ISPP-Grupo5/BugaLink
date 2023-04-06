import { fetcherAuth } from '@/utils/fetcher';
import useSWR from 'swr';

export default function useDriver(driverId) {
  const { data, error, isLoading } = useSWR(driverId && `/drivers/${driverId}`,
    fetcherAuth
    );

  return {
    driver: data,
    isLoading,
    isError: error,
  };
}
