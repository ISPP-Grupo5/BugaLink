import { useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import RoutingMachine from './routingMachine';

type props = {
  origin: string;
  destination: string;
  resultOrigin: number[];
  resultDestination: number[];
  setResultOrigin: (result: number[]) => void;
  setResultDestination: (result: number[]) => void;
  setTime?: (time: number) => void;
};

export default function LeafletMap({ origin, destination, resultOrigin, resultDestination, setResultOrigin, setResultDestination, setTime }: props) {
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

  if(!resultOrigin || !resultDestination) return null; 
  return (
    <MapContainer
      center={[Math.floor(resultOrigin[0]), Math.floor(resultOrigin[1])]}
      scrollWheelZoom={true}
      zoomControl={false}
      style={{ height: '100%', width: '100%', zIndex: 0 }}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RoutingMachine
        origin={resultOrigin}
        destination={resultDestination}
        setTime={setTime ? setTime : null}
      />
    </MapContainer>
  );
}
