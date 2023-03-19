import dynamic from 'next/dynamic';
import Link from 'next/link';

type Props = {
  className?: string;
  origin: string;
  resultOrigin: number[];
  setResultOrigin: (result: number[]) => void;
  destination: string;
  resultDestination: number[];
  setResultDestination: (result: number[]) => void;
  setTime?: (time: number) => void;
};

export const LeafletMap = dynamic(() => import('./map'), {
  ssr: false,
});

export default function MapPreview({
  className = '',
  origin,
  resultOrigin,
  setResultOrigin,
  destination,
  resultDestination,
  setResultDestination,
  setTime,
}: Props) {
  
  return (
    <Link href="/ride/V1StGXR8_Z5jdHi6B-myT/map" className="h-3/6 w-full">
      <div
        className={
          'flex w-full flex-row items-center justify-between py-2 ' + className
        }
      >
        {origin && destination && (
          <LeafletMap
            origin={origin}
            destination={destination}
            resultOrigin={resultOrigin}
            resultDestination={resultDestination}
            setResultOrigin={setResultOrigin}
            setResultDestination={setResultDestination}
            setTime={setTime}
          />
        )}
      </div>
    </Link>
  );
}
