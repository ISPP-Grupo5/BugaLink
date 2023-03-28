import axios from 'axios';

const axiosCustom = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production' // TODO: untested. THIS IS NOT THE CORRECT API URL YET!!
      ? process.env.PRODUCTION_API_URL || 'https://app.bugalink.es/api/v1'
      : `http://localhost:${process.env.PORT || 8000}/api/v1`,
});

axiosCustom.interceptors.request.use((config) => {
  // Add a "/" to the end of the URL if it doesn't already end with one
  // Django won't process the request otherwise
  if (!config.url.endsWith('/') && !config.url.includes('?')) config.url += '/';

  // Add the token to the header if it's not a request to the local API
  const url = config.url;
  if (
    !url.includes('http') ||
    url.includes('bugalink.es') ||
    url.includes('localhost')
  ) {
    const token = localStorage.getItem('accessToken');
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosCustom;
