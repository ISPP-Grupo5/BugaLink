import dynamic from 'next/dynamic';
import Link from 'next/link';

type Props = {
  className?: string;
  originCoords: number[];
  destinationCoords: number[];
  setTime?: (time: number) => void;
};

export const LeafletMap = dynamic(() => import('./map'), {
  ssr: false,
});

export default function MapPreview({
  className = '',
  originCoords,
  destinationCoords,
  setTime,
}: Props) {
  return (
    <Link href="/ride/V1StGXR8_Z5jdHi6B-myT/map" className="h-3/6 w-full">
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
