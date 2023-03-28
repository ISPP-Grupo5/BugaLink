import axios from 'axios';

const axiosCustom = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production' // TODO: untested. THIS IS NOT THE CORRECT API URL YET!!
      ? process.env.PRODUCTION_API_URL || 'https://app.bugalink.es/api/v1'
      : `http://localhost:${process.env.PORT || 8000}/api/v1`,
});

axiosCustom.interceptors.request.use(
  (config) => {
    // Add bearerToken if it exists
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosCustom.interceptors.request.use((config) => {
  // Add a "/" to the end of the URL if it doesn't already end with one
  // Django won't process the request otherwise
  if (!config.url.endsWith('/')) config.url += '/';
  return config;
});

export default axiosCustom;
