import fetcher from '@/utils/fetcher';
import useSWR from 'swr';

export default function useUpcomingTrips() {
  const USER_ID = 1;
  const { data, error, isLoading } = useSWR(
    // TODO: could be changed to a different endpoint if the backend implements it in some other way
    `/users/${USER_ID}/trips/upcoming`,
    fetcher
  );

  return {
    upcomingTrips: data,
    isLoading,
    isError: error,
  };
}
