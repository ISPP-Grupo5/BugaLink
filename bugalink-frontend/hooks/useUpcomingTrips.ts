import fetcher from '@/utils/fetcher';
import useSWR from 'swr';

export default function useUpcomingTrips() {
  const USER_ID = 1;
  const { data, error, isLoading } = useSWR(
    `/users/${USER_ID}/trip-requests?status=PENDING,ACCEPTED`,
    fetcher
  );

  return {
    upcomingTrips: data,
    isLoading,
    isError: error,
  };
}
