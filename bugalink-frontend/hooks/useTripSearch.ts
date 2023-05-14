import TripI from '@/interfaces/trip';
import { axiosAuth } from '@/lib/axios';
import { useState, useEffect } from 'react';

export default function useTripSearch(
  origin,
  destination,
  hourFrom,
  hourTo,
  dateFrom,
  dateTo,
  days,
  // preferences,
  minStars,
  minPrice,
  maxPrice
) {
  const [trips, setTrips] = useState<TripI[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!origin || !destination || origin === '0,0' || destination === '0,0') {
      setIsLoading(false);
      setIsError(true);
      return; // Mandatory params
    }

    setIsLoading(true);
    setIsError(false);

    const endpointParams = {
      origin: origin,
      destination: destination,
      hour_from: hourFrom,
      hour_to: hourTo,
      date_from: dateFrom,
      date_to: dateTo,
      days: days,
      // prefers_music: prefersMusic,
      min_stars: minStars,
      min_price: minPrice,
      max_price: maxPrice,
    };

    // Remove undefined params
    const truthyEndpointParams = Object.fromEntries(
      Object.entries(endpointParams).filter(([_, v]) => v)
    );

    const fetchTripSearch = async () => {
      try {
        // Endpoint example with all parameters:
        // http://127.0.0.1:8000/api/v1/trips/search/?origin=37.37616816966094,-6.002696565873753&destination=37.344752371048145,-5.978176701456456&hour_from=00%3A00&hour_to=00%3A01&date_from=2000-03-07&date_to=2025-03-08&days=Mon,Tue,Wed,Thu,Fri,Sat,Sun&prefers_music=True&min_stars=0&min_price=2.45&max_price=2.55
        const response = await axiosAuth.get(`/trips/search/`, {
          params: truthyEndpointParams,
        });
        const { data } = response;
        setTrips(data);
        setIsLoading(false);
      } catch (error) {
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchTripSearch();
  }, [
    origin,
    destination,
    hourFrom,
    hourTo,
    dateFrom,
    dateTo,
    days,
    // prefersMusic,
    minStars,
    minPrice,
    maxPrice,
  ]);

  return {
    trips,
    isLoading: isLoading,
    isError: isError,
  };
}
