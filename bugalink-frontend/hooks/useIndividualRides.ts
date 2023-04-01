import { fetcherAuth } from '@/utils/fetcher';
import useSWR from 'swr';

export default function useIndividualRides(individualRideId) {
  const { data, error, isLoading } = useSWR(
    `/individualRides/${individualRideId}`,
    fetcherAuth
  );

  return {
    individualRide: data,
    isLoading,
    isError: error,
  };
}
