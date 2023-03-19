import { MapContainer, TileLayer } from 'react-leaflet';
import RoutingMachine from './routingMachine';

export default function LeafletMap({
  originCoords,
  destinationCoords,
  setTime = null,
}) {
  return (
    <MapContainer
      scrollWheelZoom={true}
      zoomControl={false}
      style={{ height: '100%', width: '100%', zIndex: 0 }}
    >
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {originCoords && destinationCoords && (
        <RoutingMachine
          origin={originCoords}
          destination={destinationCoords}
          setTime={setTime}
        />
      )}
    </MapContainer>
  );
}
