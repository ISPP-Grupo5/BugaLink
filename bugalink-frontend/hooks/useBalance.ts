import BalanceI from '@/interfaces/balance';
import { fetcherAuth } from '@/utils/fetcher';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

export default function useBalance() {
  const user = useSession().data?.user as User;

  const { data, error, isLoading } = useSWR(
    user && `/users/${user.user_id}/balance/`,
    fetcherAuth
  );
  return {
    balance: data as BalanceI,
    isLoadingBalance: isLoading,
    isErrorBalance: error,
  };
}
