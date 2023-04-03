// "id": 1,
// "is_recurrent": false,
// "status": "PENDING",
// "note": "Esto es una nota de trip request"

import TripI from './trip';

type TripRequestI = {
  id: number;
  trip: TripI;
  is_recurrent: boolean;
  status: string;
  note: string;
};

export default TripRequestI;
