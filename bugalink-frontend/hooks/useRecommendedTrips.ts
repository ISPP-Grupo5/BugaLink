import { fetcherAuth } from '@/utils/fetcher';
import useSWR from 'swr';

export default function useRecommendedTrips() {
  const { data, error, isLoading } = useSWR(
    '/trips/recommendations',
    fetcherAuth
  );

  return {
    trips: data,
    isLoading,
    isError: error,
  };
}
