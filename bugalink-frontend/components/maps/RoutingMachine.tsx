import { createControlComponent } from '@react-leaflet/core';
import L from 'leaflet';
import 'leaflet-routing-machine';

const createRoutineMachineLayer = (props) => {
  const { source, destination, setTime } = props;

  const sourceIcon = L.divIcon({
    html: '<svg fill="none" width="15px" height="15px" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><path d="M 27.9999 51.9063 C 41.0546 51.9063 51.9063 41.0781 51.9063 28 C 51.9063 14.9453 41.0312 4.0937 27.9765 4.0937 C 14.8983 4.0937 4.0937 14.9453 4.0937 28 C 4.0937 41.0781 14.9218 51.9063 27.9999 51.9063 Z M 28.0234 35.2422 C 24.0624 35.2422 20.7812 31.9844 20.7812 28 C 20.7812 24.0625 24.0624 20.8281 28.0234 20.8281 C 31.9374 20.8281 35.2421 24.0625 35.2421 28 C 35.2421 31.9844 31.9374 35.2422 28.0234 35.2422 Z"/></svg>',
    iconSize: [15, 15],
  });

  const destinationIcon = L.divIcon({
    html: '<svg width="15px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.3856 23.789L11.3831 23.7871L11.3769 23.7822L11.355 23.765C11.3362 23.7501 11.3091 23.7287 11.2742 23.7008C11.2046 23.6451 11.1039 23.5637 10.9767 23.4587C10.7224 23.2488 10.3615 22.944 9.92939 22.5599C9.06662 21.793 7.91329 20.7041 6.75671 19.419C5.60303 18.1371 4.42693 16.639 3.53467 15.0528C2.64762 13.4758 2 11.7393 2 10C2 7.34784 3.05357 4.8043 4.92893 2.92893C6.8043 1.05357 9.34784 0 12 0C14.6522 0 17.1957 1.05357 19.0711 2.92893C20.9464 4.8043 22 7.34784 22 10C22 11.7393 21.3524 13.4758 20.4653 15.0528C19.5731 16.639 18.397 18.1371 17.2433 19.419C16.0867 20.7041 14.9334 21.793 14.0706 22.5599C13.6385 22.944 13.2776 23.2488 13.0233 23.4587C12.8961 23.5637 12.7954 23.6451 12.7258 23.7008C12.6909 23.7287 12.6638 23.7501 12.645 23.765L12.6231 23.7822L12.6169 23.7871L12.615 23.7885C12.615 23.7885 12.6139 23.7894 12 23L12.6139 23.7894C12.2528 24.0702 11.7467 24.0699 11.3856 23.789ZM12 23L11.3856 23.789C11.3856 23.789 11.3861 23.7894 12 23ZM15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10Z" fill="currentColor"/></svg>',
    iconSize: [15, 20],
  });

  const instance = L.Routing.control({
    waypoints: [
      L.latLng(source[0], source[1]),
      L.latLng(destination[0], destination[1]),
    ],
    lineOptions: {
      styles: [{ color: '#38a3a5', weight: 4 }],
      extendToWaypoints: false,
      missingRouteTolerance: 0,
    },
    alternativeClassName: 'hidden',
    plan: L.Routing.plan(
      [
        L.latLng(source[0], source[1]),
        L.latLng(destination[0], destination[1]),
      ],
      {
        createMarker: function (i, wp, nWps) {
          if (i === 0) {
            return L.marker(wp.latLng, { icon: sourceIcon });
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
