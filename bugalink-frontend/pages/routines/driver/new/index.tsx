import { useEffect, useState } from 'react';
import NewRoutine from '@/components/pages/routines/common';
import NEXT_ROUTES from '@/constants/nextRoutes';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';
import useDriverRoutines from '@/hooks/useDriverRoutines';

export default function NewDriverRoutine() {
  const router = useRouter();
  const { data } = useSession();
  const user = data?.user as User;
  const [freeSeatsNumber, setFreeSeatsNumber] = useState(1);
  const id = router.query.id as string;
  const { driverRoutines } = useDriverRoutines(id);

  useEffect(() => {
    if (user && !user.is_validated_driver) {
      router.push(NEXT_ROUTES.BECOME_DRIVER);
    }
  }, [user]);

  return (
    <NewRoutine
      userType="driver"
      freeSeatsNumber={freeSeatsNumber}
      setFreeSeatsNumber={setFreeSeatsNumber}
      routineDetailsDriver={driverRoutines}
    />
  );
}
