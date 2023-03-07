import { useState } from 'react';
import NewRoutine from '../../../../../../components/pages/routines/common';

export default function NewDriverRoutine() {
  const [freeSeatsNumber, setFreeSeatsNumber] = useState(1);

  return (
    <NewRoutine
      userType="driver"
      freeSeatsNumber={freeSeatsNumber}
      setFreeSeatsNumber={setFreeSeatsNumber}
    />
  );
}
