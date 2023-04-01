import { fetcherAuth } from '@/utils/fetcher';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

export default function useIndividualRides(individualRideId) {
  const { data: userData } = useSession();
  const user = userData?.user as User;

  const { data, error, isLoading } = useSWR(
    user && [`/individualRides/${individualRideId}`, user?.access],
    fetcherAuth
  );

  return {
    individualRide: data,
    isLoading,
    isError: error,
  };
}
