import LocationI from './location';

type DriverRoutineI = {
  id: number;
  origin: LocationI;
  destination: LocationI;
  days_of_week: number[];
  departure_time_start: string; // 19:20:00
  departure_time_end: string; // 19:20:00
  price: string; // 2.50
  note: string;
  is_recurrent: boolean;
  available_seats: number;
};

export default DriverRoutineI;
