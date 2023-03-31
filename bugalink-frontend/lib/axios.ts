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
  // TODO: withCredentials: true ???
});

axiosCustom.interceptors.request.use(async (config) => {
  // Add a "/" to the end of the URL if it doesn't already end with one
  // Django won't process the request otherwise
  if (!config.url.endsWith('/') && !config.url.includes('?')) config.url += '/';
  return config;
});

axiosAuth.interceptors.request.use(async (config) => {
  // Add a "/" to the end of the URL if it doesn't already end with one
  // Django won't process the request otherwise
  if (!config.url.endsWith('/') && !config.url.includes('?')) config.url += '/';
  return config;
});

//   // Add the token to the header if it's not a request to the local API
//   const url = config.url;
//   if (
//     !url.includes('http') ||
//     url.includes('bugalink.es') ||
//     url.includes('localhost') ||
//     url.includes('127.0.0.1')
//   ) {
//     // TODO: ADD BEARER TOKEN IN THE PETITION, now handled in the hook!
//   }
//   return config;
// });

export default axiosCustom;
