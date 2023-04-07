// "id": 1,
// "is_recurrent": false,
// "status": "PENDING",
// "note": "Esto es una nota de trip request"

import TripI from './trip';

type TripRequestI = {
  id: number;
  note: string;
  passenger: number; // passenger_id
  status: string;
  trip: TripI;
};

export default TripRequestI;
