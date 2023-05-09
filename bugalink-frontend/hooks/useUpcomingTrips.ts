import TripRequestI from '@/interfaces/tripRequest';
import { fetcherAuth } from '@/utils/fetcher';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

export default function useUpcomingTrips() {
  const { data: userData } = useSession();
  const user = userData?.user as User;

  const { data, error, isLoading } = useSWR(
    user &&
      `/users/${user?.user_id}/trip-requests/?requestStatus=PENDING,ACCEPTED&tripStatus=PENDING&distinct=true`,
    fetcherAuth
  );

  // Sort such that most recent trips are first
  if (data) {
    data.sort((a: TripRequestI, b: TripRequestI) => {
      const dateA = new Date(a.trip.departure_datetime);
      const dateB = new Date(b.trip.departure_datetime);
      return dateB.getTime() - dateA.getTime();
    });
  }

  return {
    upcomingTrips: data,
    isLoading,
    isError: error,
  };
}
