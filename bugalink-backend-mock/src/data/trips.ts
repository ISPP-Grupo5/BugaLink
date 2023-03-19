import { sampleUsers } from './users';

export const sampleTrips = [
  {
    id: 1,
    driver: sampleUsers['paco'],
    passengers: [sampleUsers['pedro'], sampleUsers['marta']],
    origin: 'Calle de la Luna, 1, 28001 Madrid',
    destination: 'Calle de la Luna, 2, 28001 Madrid',
    date: '14 de Marzo de 2023, 12:00',
    price: 2,
  },
  {
    id: 2,
    driver: sampleUsers['luis'],
    passengers: [
      sampleUsers['pedro'],
      sampleUsers['marta'],
      sampleUsers['paco'],
    ],
    origin: 'Calle Tajo, 20, 41701, Dos Hermanas',
    destination: 'Calle Romera, 1, 41701, Dos Hermanas',
    date: '11 de Marzo de 2023, 17:30',
    price: 1.5,
  },

  {
    id: 3,
    driver: sampleUsers['pedro'],
    passengers: [sampleUsers['marta'], sampleUsers['paco']],
    origin: 'Calle de la Luna, 1, 28001 Madrid',
    destination: 'Calle de la Luna, 2, 28001 Madrid',
    date: '17 de Marzo de 2023, 11:40',
    price: 1.75,
  },
  {
    id: 4,
    driver: sampleUsers['marta'],
    passengers: [sampleUsers['pedro'], sampleUsers['paco']],
    origin: 'Calle de la Luna, 1, 28001 Madrid',
    destination: 'Calle de la Luna, 2, 28001 Madrid',
    date: '14 de Marzo de 2023: 7:30',
    price: 2.0,
  },
];
