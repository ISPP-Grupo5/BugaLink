import axios from 'axios';

const baseURL =
  process.env.NODE_ENV === 'production' // TODO: untested. THIS IS NOT THE CORRECT API URL YET!!
    ? process.env.PRODUCTION_API_URL || 'https://app.bugalink.es/api/v1'
    : `http://localhost:${process.env.PORT || 8000}/api/v1`;

export const axiosCustom = axios.create({
  baseURL,
});

// NOTE: use this axios instance for requests that NEED authentication in our API
export const axiosAuth = axios.create({
  baseURL,
});

axiosCustom.interceptors.request.use(async (config) => {
  if (!config.url.endsWith('/') && !config.url.includes('?')) config.url += '/';
  return config;
});

axiosAuth.interceptors.request.use(async (config) => {
  // Add a "/" to the end of the URL if it doesn't already end with one
  // Django won't process the request otherwise
  if (!config.url.endsWith('/') && !config.url.includes('?')) config.url += '/';
  // TODO: handle JWT token here with async getSession()
  return config;
});

export default axiosCustom;
