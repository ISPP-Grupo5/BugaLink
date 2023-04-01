import { fetcherAuth } from '@/utils/fetcher';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

export default function useDriver(driverId) {
  const { data: userData } = useSession();
  const user = userData?.user as User;

  const { data, error, isLoading } = useSWR(
    user && driverId && [() => '/drivers/' + driverId, user?.access],
    fetcherAuth
  );

  return {
    driver: data,
    isLoading,
    isError: error,
  };
}
