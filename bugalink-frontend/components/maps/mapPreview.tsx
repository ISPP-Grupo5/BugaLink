import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect } from 'react';

type Props = {
  className?: string;
  source: string;
  resultSource: number[];
  setResultSource: (result: number[]) => void;
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
  source,
  resultSource,
  setResultSource,
  destination,
  resultDestination,
  setResultDestination,
  setTime,
}: Props) {
  useEffect(() => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${source}&key=AIzaSyD9tGiM0f6M9NDjoLCG853316Iv8UrdeAs`
    )
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        setResultSource([
          jsonData.results[0].geometry.location.lat,
          jsonData.results[0].geometry.location.lng,
        ]);
      })
      .catch((error) => {
        console.log(error);
      });

    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${destination}&key=AIzaSyD9tGiM0f6M9NDjoLCG853316Iv8UrdeAs`
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
        {resultSource && resultDestination && (
          <LeafletMap
            source={resultSource}
            destination={resultDestination}
            setTime={setTime}
          />
        )}
      </div>
    </Link>
  );
}
