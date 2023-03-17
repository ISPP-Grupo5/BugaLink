import fetcher from '@/utils/fetcher';
import useSWR from 'swr';

export default function useHistoryTrips(props) {
  const { type } = props;
  const USER_ID = 1;
  const { data, error, isLoading } = useSWR(
    `/users/${USER_ID}/trips/history?type=${type}`, // Driver or passenger
    fetcher
  );

  return {
    historyTrips: data,
    isLoading,
    isError: error,
  };
}
