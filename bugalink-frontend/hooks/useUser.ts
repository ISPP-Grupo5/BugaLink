import { fetcherAuth } from '@/utils/fetcher';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

export default function useUser(id) {
  const { data: userData } = useSession();
  const user = userData?.user as User;

  const { data, error, isLoading } = useSWR(
    user && [`/users/${id}/`, user?.access],
    fetcherAuth
  );

  return {
    user: data,
    isLoading,
    isError: error,
  };
}
