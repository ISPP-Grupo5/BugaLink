import LastTransactionsI from '@/interfaces/lastTransactions';
import { fetcherAuth } from '@/utils/fetcher';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

export default function useLastTransactions() {
  const user = useSession().data?.user as User;
  const { data, error, isLoading } = useSWR(
    user && `/users/${user.user_id}/transactions/recent`,
    fetcherAuth
  );
  return {
    lastTransactions: data as LastTransactionsI[],
    isLoadingLastTransactions: isLoading,
    isErrorLastTransactions: error,
  };
}
