import LocationI from './location';

type PassengerRoutineI = {
  id: number;
  origin: LocationI;
  destination: LocationI;
  day_of_week: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  departure_time_start: string; // "18:40:00"
  departure_time_end: string; // "18:55:00"
  type: string;
};

export default PassengerRoutineI;
