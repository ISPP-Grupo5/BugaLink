import { fetcherAuth } from '@/utils/fetcher';
import useSWR from 'swr';

export default function useNumPendingRequests() {
  const { data, error, isLoading } = useSWR(
    `/trip-requests/pending/count/`,
    fetcherAuth
  );

  return {
    numPendingRequests: data?.count as number,
    isLoading,
    isError: error,
  };
}
