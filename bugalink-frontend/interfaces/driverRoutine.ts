import LocationI from './location';

type DriverRoutineI = {
  id: number;
  origin: LocationI;
  destination: LocationI;
  day_of_week: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
  departure_time_start: string; // 19:20:00
  departure_time_end: string; // 19:20:00
  price: string; // 2.50
  note: string;
  is_recurrent: boolean;
  available_seats: number;
  type: string;
};

export default DriverRoutineI;
