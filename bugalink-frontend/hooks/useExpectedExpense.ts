import { fetcherAuth } from '@/utils/fetcher';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

export default function useExpectedExpense() {
  const user = useSession().data?.user as User;
  const { data, error, isLoading } = useSWR(
    user && `/users/${user.user_id}/transactions/expected-expense`,
    fetcherAuth
  );
  return {
    expectedExpense: data as string,
    isLoadingExpectedExpense: isLoading,
    isErrorExpectedExpense: error,
  };
}
