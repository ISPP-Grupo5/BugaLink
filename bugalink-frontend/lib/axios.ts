import { APIError } from '@/interfaces/error';
import { emitError } from '@/utils/notifications';
import axios, { AxiosError } from 'axios';
import { User } from 'next-auth';
import { getSession } from 'next-auth/react';

const baseURL = `${process.env.NEXT_PUBLIC_BACKEND_URL || ''}/api/v1`;

export const axiosCustom = axios.create({ baseURL });

// NOTE: use this axios instance for requests that NEED authentication in our API
export const axiosAuth = axios.create({ baseURL });

const requestInterceptor = async (config) => {
  if (!config.url.endsWith('/') && !config.url.includes('?')) config.url += '/';
  return config;
};

const requestInterceptorWithAuth = async (config) => {
  const session = await getSession();
  const user = session?.user as User;

  // Add a "/" to the end of the URL if it doesn't already end with one
  // Django won't process the request otherwise
  if (!config.url.endsWith('/') && !config.url.includes('?')) config.url += '/';
  if (session) config.headers.Authorization = `Bearer ${user.access}`;
  return config;
};

const errorInterceptor = async (error: AxiosError) => {
  const IGNORED_ERRORS = ['not_authenticated', 'not_found'];
  const response = error.response?.data as APIError;
  response.errors?.forEach((err) => {
    const title = `${err.code}`;
    const message = err.attr ? `${err.attr}: ${err.detail}` : err.detail;
    if (!IGNORED_ERRORS.includes(err.code) && message)
      emitError({ title, message });
  });

  if (!response.errors?.length) {
    Object.keys(response).forEach((key) => {
      const title = `${key}`;
      const message = `${key}: ${response[key]}`;
      if (!IGNORED_ERRORS.includes(key) && message)
        emitError({ title, message });
    });
  }

  return Promise.reject(error);
};

axiosCustom.interceptors.request.use(requestInterceptor);
axiosAuth.interceptors.request.use(requestInterceptorWithAuth);

axiosCustom.interceptors.response.use(undefined, errorInterceptor);
axiosAuth.interceptors.response.use(undefined, errorInterceptor);

export default axiosCustom;
