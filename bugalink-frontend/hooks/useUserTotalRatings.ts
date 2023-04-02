import { fetcher } from '@/utils/fetcher';
import useSWR from 'swr';

export default function useUserTotalRatings(id) {
  const { data, error, isLoading } = useSWR(
    `/users/${id}/reviews/rating`,
    fetcher
  );

  return {
    userTotalRatings: data,
    isLoading,
    isError: error,
  };
}
