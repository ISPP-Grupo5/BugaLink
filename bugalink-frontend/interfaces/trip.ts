import UserI from './user';

type TripI = {
  id: number;
  type: 'driver' | 'passenger';
  driver: UserI;
  passengers: UserI[];
  rating: number;
  gender: string;
  avatar: string;
  origin: string;
  destination: string;
  date: string;
  price: number;
};

export default TripI;
