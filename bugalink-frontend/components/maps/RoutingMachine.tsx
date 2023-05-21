import { createControlComponent } from '@react-leaflet/core';
import L from 'leaflet';
import 'leaflet-routing-machine';

const createRoutineMachineLayer = (props) => {
  const { origin, destination, setTime, setDuration, setTotalDistance } = props;

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
      addWaypoints: false,
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
      const minutes = Math.round(summary.totalTime / 60);
      setTime(minutes);
      const tripDuration = parseMinutesToHHMM(minutes);
      if(setDuration) setDuration(tripDuration);
    });
  }

  if (setTotalDistance) {
    instance.on('routesfound', (e) => {
      const routes = e.routes;
      const summary = routes[0].summary;
      setTotalDistance(Math.round(summary.totalDistance / 1000));
    });
  }

  return instance;
};

const parseMinutesToHHMM = (minutes : number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  let result = '';
  
  if (hours > 0) {
    result += `${hours} h`;
  }

  if (hours > 0 && remainingMinutes > 0) {
    result += ' y ';
  }
  
  if (remainingMinutes > 0) {
    const minuteLabel = remainingMinutes === 1 ? 'min' : 'mins';
    result += `${remainingMinutes} ${minuteLabel}`;
  }

  return result;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
