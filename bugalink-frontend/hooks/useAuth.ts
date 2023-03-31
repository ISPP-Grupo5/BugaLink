import { decodeJWT } from '@/utils/jwt';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import useAxiosAuth from './useAxiosAuth';

const useAuth = () => {
  // Using the useSession hook from next-auth/react
  // bring the information about the authenticated user
  const [user, setUser] = useState(undefined);

  // status: enum mapping to three possible session states: "loading" | "authenticated" | "unauthenticated"
  // https://next-auth.js.org/getting-started/client
  const { data, status } = useSession();
  const axiosAuth = useAxiosAuth();

  useEffect(() => {
    if (!data) return;
    const token = data?.user?.access;
    const { userId } = decodeJWT(token);

    if (!userId) return;

    const fetchUser = async () => {
      const { data: session, status } = await axiosAuth.get(
        `/users/${userId}/`
      );
      setUser(session);
    };

    fetchUser();
  }, [data]);

  return { user, status };
};

export default useAuth;
