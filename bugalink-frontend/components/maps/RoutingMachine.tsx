import { createControlComponent } from '@react-leaflet/core';
import L from 'leaflet';
import 'leaflet-routing-machine';

const createRoutineMachineLayer = (props) => {
  const { origin, destination, setTime } = props;

  const originIcon = L.icon({
    iconUrl:
      'https://www.shareicon.net/data/512x512/2015/08/23/89467_circle_512x512.png',
    iconSize: [20, 20],
  });

  const destinationIcon = L.icon({
    iconUrl:
      'https://usefulicons.com/uploads/icons/202005/2971/8da69fd82c50.png',
    iconSize: [20, 20],
  });

  const instance = L.Routing.control({
    waypoints: [
      L.latLng(origin.lat, origin.lng),
      L.latLng(destination.lat, destination.lng),
    ],
    lineOptions: {
      styles: [{ color: '#38a3a5', weight: 4 }],
      extendToWaypoints: false,
      missingRouteTolerance: 0,
    },
    alternativeClassName: 'hidden',
    plan: L.Routing.plan(
      [
        L.latLng(origin.lat, origin.lng),
        L.latLng(destination.lat, destination.lng),
      ],
      {
        createMarker: function (i, wp, nWps) {
          if (i === 0) {
            return L.marker(wp.latLng, { icon: originIcon });
          }
          return L.marker(wp.latLng, { icon: destinationIcon });
        },
      }
    ),
  });

  if (setTime) {
    instance.on('routesfound', (e) => {
      const routes = e.routes;
      const summary = routes[0].summary;
      setTime(Math.round((summary.totalTime % 3600) / 60));
    });
  }

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
