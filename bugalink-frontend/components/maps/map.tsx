import { MapContainer, TileLayer } from 'react-leaflet';
import RoutingMachine from './RoutingMachine';

type props = {
  source: [] | [number, number];
  destination: [] | [number, number];
  setTime: (time: number) => void;
};

export default function LeafletMap({ source, destination, setTime }: props) {
  return (
    <MapContainer
      center={[Math.floor(source[0]), Math.floor(source[1])]}
      zoom={6}
      scrollWheelZoom={true}
      zoomControl={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <RoutingMachine
        source={source}
        destination={destination}
        setTime={setTime}
      />
    </MapContainer>
  );
}
