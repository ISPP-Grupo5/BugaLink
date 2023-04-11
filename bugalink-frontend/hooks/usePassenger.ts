import PassengerI from '@/interfaces/passenger';
import { fetcherAuth } from '@/utils/fetcher';
import useSWR from 'swr';

export default function usePassenger(passengerId) {
  const { data, error, isLoading } = useSWR(
    passengerId && `/passengers/${passengerId}`,
    fetcherAuth
  );

  return {
    passenger: data as PassengerI,
    isLoading,
    isError: error,
  };
}
