import fetcher from '@/utils/fetcher';
import useSWR from 'swr';

export default function useIndividualRides(individualRideId) {
  // TODO: once we have local sessions, we can extract the user id from the session

  const { data, error, isLoading } = useSWR(
    `/rides/individual/${individualRideId}`,
    fetcher
  );

  return {
    individualRide: data,
    isLoading,
    isError: error,
  };
}
