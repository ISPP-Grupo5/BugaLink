import { sampleUsers } from './data/users';

export const sampleTrips = [
  {
    id: 1,
    driver: sampleUsers['pedro'],
    passengers: [sampleUsers['marta']],
    origin: 'Centro Comercial Way',
    destination: 'ETSII',
    date: '14 de Marzo de 2023, 12:00',
    price: 2,
    requestStatus: 'pending',
  },
  {
    id: 2,
    driver: sampleUsers['marta'],
    passengers: [sampleUsers['paco']],
    origin: 'Avenida Andalucía, Dos Hermanas',
    destination: 'La Motilla',
    date: '11 de Marzo de 2023, 17:30',
    price: 1.5,
    requestStatus: 'pending',
  },
  {
    id: 3,
    driver: sampleUsers['paco'],
    passengers: [sampleUsers['pedro']],
    origin: 'Centro Comercial Way',
    destination: 'ETSII',
    date: '14 de Marzo de 2023, 12:00',
    price: 2,
    requestStatus: 'pending',
  },
  {
    id: 4,
    driver: sampleUsers['pedro'],
    passengers: [
      sampleUsers['marta'],
      sampleUsers['paco'],
      sampleUsers['luis'],
    ],
    origin: 'Avenida Andalucía, Dos Hermanas',
    destination: 'La Motilla',
    date: '11 de Marzo de 2023, 17:30',
    price: 1.5,
    requestStatus: 'accepted',
  },
];

export const sampleTripRequests = [
  {
    id: 1,
    type: 'recurring',
    driver: {
      id: 2,
      name: 'Paco Perez',
      rating: 4.6,
      avatar: '/assets/avatar.png',
      gender: 'M',
    },
    requestedBy: {
      id: 1,
      name: 'Pedro Sánchez',
      rating: 3.5,
      avatar: '/assets/avatar.png',
      gender: 'M',
    },
    requestStatus: 'pending',
    origin: 'Centro Comercial Way',
    destination: 'ETSII',
    date: 'Cada lunes, 12:00',
    price: 2,
  },
  {
    id: 2,
    type: 'onetime',
    driver: {
      id: 3,
      name: 'Josefina Mayo',
      rating: 4.7,
      avatar: '/assets/avatar.svg',
    },
    requestedBy: {
      id: 4,
      name: 'Luisa Fernanda Rodríguez',
      rating: 5.0,
      avatar: '/assets/avatar.png',
      gender: 'F',
    },
    requestStatus: 'pending',
    origin: 'Avenida Andalucía, Dos Hermanas',
    destination: 'La Motilla',
    date: '11 de Marzo de 2023, 17:30',
    price: 1.5,
  },
];
export const sampleRoutines = [
  {
    id: 1,
    departureHourStart: '9:00',
    departureHourEnd: '9:30',
    type: 'driver',
    origin: 'San Jacinto, Triana, Sevilla, 41010',
    destination: 'Centro comercial Lagoh, Sevilla, 41007',
    day: 'Lunes',
  },
  {
    id: 2,
    departureHourStart: '15:00',
    departureHourEnd: '15:30',
    type: 'passenger',
    origin: 'San Jacinto, Triana, Sevilla, 41010',
    destination: 'Centro comercial Lagoh, Sevilla, 41007',
    day: 'Jueves',
  }

];