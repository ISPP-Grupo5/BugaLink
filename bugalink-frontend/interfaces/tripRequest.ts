type TripRequestI = {
  id: number;
  type: 'recurring' | 'onetime';
  driver: {
    id: number;
    name: string;
    rating: number;
    avatar: string;
    gender: 'M' | 'F';
  };
  requestedBy: {
    id: number;
    name: string;
    rating: number;
    avatar: string;
    gender: 'M' | 'F';
  };
  requestStatus: 'pending';
  origin: string;
  destination: string;
  date: string;
  price: number;
};

export default TripRequestI;
