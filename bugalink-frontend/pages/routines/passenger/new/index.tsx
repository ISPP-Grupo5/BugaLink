import NewRoutine from '@/components/pages/routines/common';
import usePassengerRoutines from '@/hooks/usePassengerRoutines';
import { useRouter } from 'next/router';

export default function NewPassengerRoutine() {
  const router = useRouter();
  const id = router.query.id as string;
  const { passengerRoutines } = usePassengerRoutines(id);

  return (
    <NewRoutine
      userType="passenger"
      routineDetailsPassenger={passengerRoutines}
    />
  );
}
