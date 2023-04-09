// Description: This hook is used to get the bookmarked trips of the user
// It has a method to add a trip to the bookmarked trips
// It has a method to remove a trip from the bookmarked trips
// It has a method to check if a trip is bookmarked or not
// It has a method to get the bookmarked trips
// Everything is stored in the local storage

import TripI from '@/interfaces/trip';
import { useState, useEffect } from 'react';

export default function useBookmarkTrips() {
  const [bookmarkedTrips, setBookmarkedTrips] = useState<TripI[]>([]);

  useEffect(() => {
    const bookmarkedTrips = localStorage.getItem('bookmarkedTrips');
    if (bookmarkedTrips) {
      setBookmarkedTrips(JSON.parse(bookmarkedTrips));
    }
  }, []);

  const addTripToBookmarks = (trip: TripI) => {
    if (isTripBookmarked(trip.id)) return;
    const newBookmarkedTrips = [...bookmarkedTrips, trip];
    setBookmarkedTrips(newBookmarkedTrips);
    localStorage.setItem('bookmarkedTrips', JSON.stringify(newBookmarkedTrips));
  };

  const removeTripFromBookmarks = (tripId: number) => {
    const newBookmarkedTrips = bookmarkedTrips.filter(
      (trip) => trip.id !== tripId
    );
    setBookmarkedTrips(newBookmarkedTrips);
    localStorage.setItem('bookmarkedTrips', JSON.stringify(newBookmarkedTrips));
  };

  const isTripBookmarked = (tripId: number) => {
    return bookmarkedTrips.some((trip: TripI) => trip.id === tripId);
  };

  return {
    addTripToBookmarks,
    removeTripFromBookmarks,
    isTripBookmarked,
    bookmarkedTrips,
  };
}
