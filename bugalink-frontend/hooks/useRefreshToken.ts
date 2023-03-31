'use client';

import axios from '@/lib/axios';
import { signIn, useSession } from 'next-auth/react';

export const useRefreshToken = () => {
  const { data: session } = useSession();

  const refreshToken = async () => {
    const res = await axios.post('/auth/token/refresh/', {
      refresh: session?.user.refresh,
    });

    if (session) {
      session.user.access = res.data.access;
    } else signIn();
  };
  return refreshToken;
};
