// GenericRoutineI exposes a generic interface for a routine. It has fields common for both driver and passenger routines.
// This is useful for trating both routines as the same, for example, when displaying them in "My routines" page.

import LocationI from './location';

type GenericRoutineI = {
  id: number;
  origin: LocationI;
  destination: LocationI;
  day: string; // 0-6
  departure_time_start: string; // "18:40:00"
  departure_time_end: string; // "18:55:00"
  type: 'driverRoutine' | 'passengerRoutine';
};

export default GenericRoutineI;
