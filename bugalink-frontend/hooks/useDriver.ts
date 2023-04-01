import useSWR from 'swr';

export default function useDriver(driverId) {
  const { data, error, isLoading } = useSWR(driverId && `/drivers/${driverId}`);

  return {
    driver: data,
    isLoading,
    isError: error,
  };
}
