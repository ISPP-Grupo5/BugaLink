import fetcher from '@/utils/fetcher';
import useSWR from 'swr';

export default function useRideDetails(id) {
  const { data, error, isLoading } = useSWR(`/rides/${id}/detail`, fetcher);

  return {
    rideData: data,
    isLoading,
    isError: error,
  };
}