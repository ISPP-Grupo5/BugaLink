import { fetcherAuth } from '@/utils/fetcher';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

export default function useRecommendedTrips() {
  const { data: userData } = useSession();
  const user = userData?.user as User;

  const { data, error, isLoading } = useSWR(
    user && ['/trips/recommendations', user?.access],
    fetcherAuth
  );

  return {
    trips: data,
    isLoading,
    isError: error,
  };
}
