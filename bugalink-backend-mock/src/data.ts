export const sampleTrips = [
  {
    id: 1,
    type: 'driver',
    rating: 4.6,
    driver: {
      name: 'Paco Perez',
    },
    avatar: '/assets/avatar.png',
    gender: 'M',
    origin: 'Centro Comercial Way',
    destination: 'ETSII',
    date: '14 de Marzo de 2023, 12:00',
    price: 2,
  },
  {
    id: 2,
    type: 'driver',
    rating: 4.7,
    driver: {
      name: 'Josefina Mayo',
    },
    avatar: '/assets/avatar.svg',
    gender: 'F',
    origin: 'Avenida Andalucía, Dos Hermanas',
    destination: 'La Motilla',
    date: '11 de Marzo de 2023, 17:30',
    price: 1.5,
  },
  {
    id: 3,
    type: 'driver',
    rating: 4.7,
    driver: {
      name: 'Alberto Chicote',
    },
    avatar: '/assets/avatar.png',
    gender: 'M',
    origin: 'Centro Comercial Lagoh',
    destination: 'Isla Mágica',
    date: '17 de Marzo de 2023, 11:40',
    price: 1.75,
  },
  {
    id: 4,
    type: 'driver',
    rating: 4.7,
    driver: {
      name: 'Laura Laureada',
    },
    avatar: '/assets/avatar.svg',
    gender: 'F',
    origin: 'La Cartuja',
    destination: 'Facultad de Psicología',
    date: '14 de Marzo de 2023: 7:30',
    price: 2.0,
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

export const sampleUser = {
  id: 1,
  name: 'Paco',
  lastName: 'Perez',
  photo: '/assets/avatar.png',
};
