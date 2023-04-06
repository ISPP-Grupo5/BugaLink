import { fetcherAuth } from '@/utils/fetcher';
import useSWR from 'swr';

export default function useReviews(userId) {
  // TODO: once we have local sessions, we can extract the user id from the session

  const { data, error, isLoading } = useSWR(
    `/users/${userId}/rating`,
    fetcherAuth
  );

  return {
    reviews: data,
    isLoadingReviews: isLoading,
    isErrorReviews: error,
  };
}
