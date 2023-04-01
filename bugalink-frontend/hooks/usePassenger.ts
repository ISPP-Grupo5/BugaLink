import { fetcherAuth } from '@/utils/fetcher';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

export default function usePassenger(passengerId) {
  const { data: userData } = useSession();
  const user = userData?.user as User;

  const { data, error, isLoading } = useSWR(
    user && passengerId && [`/passengers/${passengerId}`, user?.access],
    fetcherAuth
  );

  return {
    passenger: data,
    isLoading,
    isError: error,
  };
}
