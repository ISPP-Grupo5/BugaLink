import fetcher from '@/utils/fetcher';
import useSWR from 'swr';

export default function useMapCoordinates(address) {
  const { data, error, isLoading } = useSWR(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
    fetcher
  );

  return {
    // coordinates: data?.originResult?.data?.results[0]?.geometry?.location,
    coordinates: data?.results[0]?.geometry?.location,
    isLoading,
    isError: error,
  };
}
