import { fetcherAuth } from '@/utils/fetcher';
import useSWR from 'swr';

export default function useRating(userId) {
  const { data, error, isLoading } = useSWR(
    userId && `/users/${userId}/rating/`,
    fetcherAuth
  );

  return {
    rating: data,
    isLoading,
    isError: error,
  };
}
