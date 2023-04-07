import TripRequestI from '@/interfaces/tripRequest';
import { fetcherAuth } from '@/utils/fetcher';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

export default function usependingRequests() {
  const { data: userData } = useSession();
  const user = userData?.user as User;

  const { data, error, isLoading } = useSWR(
    user && `/users/${user.user_id}/trip-requests/?status=PENDING&role=driver`,
    fetcherAuth
  );

  return {
    pendingRequests: data as TripRequestI[],
    isLoading,
    isError: error,
  };
}
