import LocationI from './location';

type PassengerRoutineI = {
  id: number;
  origin: LocationI;
  destination: LocationI;
  days_of_week: string[];
  departure_time_start: string; // "18:40:00"
  departure_time_end: string; // "18:55:00"
  type: string;
};

export default PassengerRoutineI;
