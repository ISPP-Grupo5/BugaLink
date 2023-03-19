import { MapContainer, TileLayer } from 'react-leaflet';
import RoutingMachine from './routingMachine';

type props = {
  origin: number[];
  destination: number[];
  setTime?: (time: number) => void;
};

export default function LeafletMap({ origin, destination, setTime }: props) {
  return (
    <MapContainer
      center={[Math.floor(origin[0]), Math.floor(origin[1])]}
      scrollWheelZoom={true}
      zoomControl={false}
      style={{ height: '100%', width: '100%', zIndex: 0 }}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <RoutingMachine
        origin={origin}
        destination={destination}
        setTime={setTime ? setTime : null}
      />
    </MapContainer>
  );
}
