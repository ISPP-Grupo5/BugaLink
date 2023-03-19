import { MapContainer, TileLayer } from 'react-leaflet';

export default function LeafletMap() {
  return (
    <MapContainer
      center={[40.46, -3.74]}
      zoom={5}
      scrollWheelZoom={true}
      zoomControl={false}
      style={{ height: '100%', width: '100%', zIndex: 0 }}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );
}
