import { fetcherAuth } from '@/utils/fetcher';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

export default function useUpcomingTrips() {
  const { data: userData } = useSession();
  const user = userData?.user as User;

  const { data, error, isLoading } = useSWR(
    user &&
      `/users/${user?.user_id}/trip-requests/?requestStatus=PENDING,ACCEPTED&tripStatus=PENDING`,
    fetcherAuth
  );

  return {
    upcomingTrips: data,
    isLoading,
    isError: error,
  };
}
