import TripRequestI from '@/interfaces/tripRequest';
import { axiosAuth } from '@/lib/axios';
import { useEffect, useState } from 'react';

export default function useTripRequest(id: string | undefined) {
  const [tripRequest, setTripRequest] = useState<TripRequestI>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchTripRequest = async () => {
      try {
        const response = await axiosAuth.get(`/trip-requests/${id}/`);
        const { data } = response;
        setTripRequest(data);
        setIsLoading(false);
      } catch (error) {
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchTripRequest();
  }, [id]);

  return { tripRequest, isLoading, isError };
}
