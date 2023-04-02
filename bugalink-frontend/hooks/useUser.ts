import { fetcherAuth } from '@/utils/fetcher';
import useSWR from 'swr';

export default function useUser(id) {
  const { data, error, isLoading } = useSWR(`/users/${id}/`, fetcherAuth);

  return {
    user: data,
    isLoading,
    isError: error,
  };
}
