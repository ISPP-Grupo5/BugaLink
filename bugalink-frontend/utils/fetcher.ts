import { axiosCustom } from '@/lib/axios';

const fetcher = (url) => axiosCustom.get(url).then((res) => res.data);

const fetcherAuth = (params) => {
  if (!params) return;
  const [url, token] = params;
  return axiosCustom
    .get(url, { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => res.data);
};

export { fetcher, fetcherAuth };
