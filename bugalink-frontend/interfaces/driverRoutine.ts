import LocationI from './location';

type DriverRoutineI = {
  id: number;
  origin: LocationI;
  destination: LocationI;
  day_of_week: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  departure_time_start: string; // 19:20:00
  departure_time_end: string; // 19:20:00
  price: string; // 2.50
  note: string;
  is_recurrent: boolean;
  available_seats: number;
  type: string;
};

export default DriverRoutineI;
