import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect } from 'react';

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
  useEffect(() => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${origin}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    )
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        setResultOrigin([
          jsonData.results[0].geometry.location.lat,
          jsonData.results[0].geometry.location.lng,
        ]);
      })
      .catch((error) => {
        console.log(error);
      });

    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${destination}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    )
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        setResultDestination([
          jsonData.results[0].geometry.location.lat,
          jsonData.results[0].geometry.location.lng,
        ]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Link href="/ride/V1StGXR8_Z5jdHi6B-myT/map" className="h-3/6 w-full">
      <div
        className={
          'flex w-full flex-row items-center justify-between py-2 ' + className
        }
      >
        {resultOrigin && resultDestination && (
          <LeafletMap
            origin={resultOrigin}
            destination={resultDestination}
            setTime={setTime}
          />
        )}
      </div>
    </Link>
  );
}
