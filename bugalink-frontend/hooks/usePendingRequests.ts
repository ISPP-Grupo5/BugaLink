import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { fetcherAuth } from '@/utils/fetcher';

export default function usependingRequests() {
  const { data: userData } = useSession();
  const user = userData?.user as User;

  const { data, error, isLoading } = useSWR(
    user && `/users/${user.user_id}/trip-requests?status=PENDING`,
    fetcherAuth
  );

  return {
    pendingRequests: data,
    isLoading,
    isError: error,
  };
}
