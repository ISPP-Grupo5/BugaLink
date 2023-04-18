import { fetcherAuth } from '@/utils/fetcher';
import useSWR from 'swr';

export default function useNumPendingChats() {
  const { data, error, isLoading } = useSWR(
    `/conversations/pending/count/`,
    fetcherAuth
  );

  return {
    numPendingChats: data?.count as number,
    isLoading,
    isError: error,
  };
}
