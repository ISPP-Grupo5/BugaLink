import { fetcherAuth } from '@/utils/fetcher';
import useSWR from 'swr';

export default function useTrip(tripId) {
  const { data, error, isLoading } = useSWR(
    `/trips/${tripId}`,
    fetcherAuth
  );

  return {
    trip: data,
    isLoading,
    isError: error,
  };
}
