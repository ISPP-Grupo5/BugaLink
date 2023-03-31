import { axiosAuth } from '@/lib/axios';

const fetcher = (url) => axiosAuth.get(url).then((res) => res.data);

export default fetcher;
