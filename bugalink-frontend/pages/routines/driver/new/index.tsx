import { useEffect, useState } from 'react';
import NewRoutine from '@/components/pages/routines/common';
import NEXT_ROUTES from '@/constants/nextRoutes';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';

export default function NewDriverRoutine() {
  const router = useRouter();
  const { data } = useSession();
  const user = data?.user as User;

  const [freeSeatsNumber, setFreeSeatsNumber] = useState(1);

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
    />
  );
}
