import { MapContainer, TileLayer } from 'react-leaflet';
import RoutingMachine from './RoutingMachine';

export default function LeafletMap({
  originCoords,
  destinationCoords,
  setTime = null,
  setDuration = null,
  setTotalDistance = null,
}) {
  return (
    <MapContainer
      scrollWheelZoom={true}
      zoomControl={false}
      style={{ height: '100%', width: '100%', zIndex: 0 }}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {originCoords && destinationCoords && (
        <RoutingMachine
          origin={originCoords}
          destination={destinationCoords}
          setTime={setTime}
          setDuration={setDuration}
          setTotalDistance={setTotalDistance}
        />
      )}
    </MapContainer>
  );
}
