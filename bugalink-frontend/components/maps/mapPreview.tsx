import NEXT_ROUTES from '@/constants/nextRoutes';
import CoordinatesI from '@/interfaces/coordinates';
import dynamic from 'next/dynamic';
import Link from 'next/link';

type Props = {
  className?: string;
  tripId: string | number;
  originCoords: CoordinatesI;
  destinationCoords: CoordinatesI;
  setTime?: (time: number) => void;
};

export const LeafletMap = dynamic(() => import('./map'), {
  ssr: false,
});

export default function MapPreview({
  className = '',
  tripId,
  originCoords,
  destinationCoords,
  setTime,
}: Props) {
  return (
    <Link
      data-cy="map-link"
      href={NEXT_ROUTES.TRIP_MAP(tripId)}
      className="h-3/6 w-full"
    >
      <div
        className={
          'flex w-full flex-row items-center justify-between py-2 ' + className
        }
      >
        <LeafletMap
          originCoords={originCoords}
          destinationCoords={destinationCoords}
          setTime={setTime}
        />
      </div>
    </Link>
  );
}
