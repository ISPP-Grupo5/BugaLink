import axios from 'axios';
import { User } from 'next-auth';
import { getSession } from 'next-auth/react';

const baseURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`;

export const axiosCustom = axios.create({ baseURL });

// NOTE: use this axios instance for requests that NEED authentication in our API
export const axiosAuth = axios.create({ baseURL });

axiosCustom.interceptors.request.use(async (config) => {
  if (!config.url.endsWith('/') && !config.url.includes('?')) config.url += '/';
  return config;
});

axiosAuth.interceptors.request.use(async (config) => {
  const session = await getSession();
  const user = session?.user as User;

  // Add a "/" to the end of the URL if it doesn't already end with one
  // Django won't process the request otherwise
  if (!config.url.endsWith('/') && !config.url.includes('?')) config.url += '/';
  if (session) config.headers.Authorization = `Bearer ${user.access}`;
  return config;
});

export default axiosCustom;
