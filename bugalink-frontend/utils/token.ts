import axios from '@/lib/axios';

export const refreshAccessToken = async (refresh) => {
  const res = await axios.post('/auth/token/refresh/', { refresh });
  return res.data.access;
};
