import { fetcherAuth } from '@/utils/fetcher';
import useSWR from 'swr';

export default function useUserStats(id) {
  const { data, error, isLoading } = useSWR(
    `/users/${id}/stats`,
    fetcherAuth
  );

  return {
    stats: data,
    isLoading,
    isError: error,
  };
}
