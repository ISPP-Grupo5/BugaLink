import useBookmarkTrip from '@/hooks/useBookmarkTrip';
import TripI from '@/interfaces/trip';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import BookmarkIcon from '/public/assets/bookmark.svg';

// This button will have a bookmark icon and will be used to bookmark a trip
// If the trip is already bookmarked, the button will have a filled bookmark icon
// If the trip is not bookmarked, the button will have an empty bookmark icon

type Props = {
  trip: TripI;
  className?: string;
};

export default function BookmarkTripButton({ trip, className = '' }: Props) {
  const {
    bookmarkedTrips,
    addTripToBookmarks,
    removeTripFromBookmarks,
    isTripBookmarked,
  } = useBookmarkTrip();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    setIsBookmarked(isTripBookmarked(trip.id));
  }, [bookmarkedTrips]);

  const handleBookmarkTrip = () => {
    isBookmarked ? removeTripFromBookmarks(trip.id) : addTripToBookmarks(trip);
  };

  return (
    <button
      className="flex h-10 w-10 items-center justify-center rounded-full"
      onClick={handleBookmarkTrip}
    >
      <BookmarkIcon
        className={cn(
          {
            'fill-black stroke-black': isBookmarked,
            'fill-transparent stroke-black': !isBookmarked,
          },
          className
        )}
      />
    </button>
  );
}
