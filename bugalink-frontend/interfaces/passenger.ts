import UserI from '@/interfaces/user';
import PassengerRoutineI from './passengerRoutine';

type PassengerI = {
  id: number;
  user: number | UserI;
  routines: PassengerRoutineI[];
};

export default PassengerI;
