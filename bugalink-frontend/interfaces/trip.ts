import UserI from './user';

type TripI = {
  id: number;
  driver: UserI;
  passengers: UserI[];
  origin: string;
  destination: string;
  date: string;
  price: number;
  requestStatus: 'pending' | 'accepted' | 'rejected';
};

export default TripI;
