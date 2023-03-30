import fetcher from '@/utils/fetcher';
import useSWR from 'swr';

export default function useHistoryTrips() {
  const USER_ID = 1;
  const { data, error, isLoading } = useSWR(
    `/users/${USER_ID}/trip-requests?status=FINISHED`,
    fetcher
  );

  return {
    historyTrips: data,
    isLoading,
    isError: error,
  };
}
