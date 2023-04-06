import { fetcherAuth } from '@/utils/fetcher';
import useSWR from 'swr';

export default function useDriverPreferences(id) {
  const { data, error, isLoading } = useSWR(`/drivers/${id}/preferences`, fetcherAuth);

  return {
    preferences: data,
    isLoadingPreferences: isLoading,
    isErrorPreferences: error,
  };
}