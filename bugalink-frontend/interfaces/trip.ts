import DriverI from './driver';
import DriverRoutineI from './driverRoutine';
import PassengerI from './passenger';

type TripI = {
  id: number;
  driver_routine: DriverRoutineI;
  passengers: PassengerI[];
  driver: DriverI;
  departure_datetime: string; // 2023-04-03T19:20:00Z
  is_recurrent: boolean;
  status: string;
  note: string;
};

export default TripI;
