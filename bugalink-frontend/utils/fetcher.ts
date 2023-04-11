import { axiosAuth, axiosCustom } from '@/lib/axios';

const fetcher = (url) => axiosCustom.get(url).then((res) => res.data);
const fetcherAuth = (url) => axiosAuth.get(url).then((res) => res.data);

export { fetcher, fetcherAuth };
