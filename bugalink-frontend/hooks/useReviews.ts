import fetcher from '@/utils/fetcher';
import useSWR from 'swr';

export default function useReviews(driverId) {
  // TODO: once we have local sessions, we can extract the user id from the session

  const { data, error, isLoading } = useSWR(
    `/api/users/${driverId}/reviews`,
    fetcher
  );

  return {
    reviews: data,
    isLoadingReviews: isLoading,
    isErrorReviews: error,
  };
}
