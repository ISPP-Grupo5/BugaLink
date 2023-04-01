import { fetcher } from '@/utils/fetcher';
import useSWR from 'swr';

export default function useUserTotalRides(id) {
  const { data, error, isLoading } = useSWR(
    `/users/${id}/rides/total`,
    fetcher
  );

  return {
    userTotalRides: data,
    isLoading,
    isError: error,
  };
}
