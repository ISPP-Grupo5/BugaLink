import { fetcherAuth } from '@/utils/fetcher';
import useSWR from 'swr';

export default function useBalance(userId) {
    const { data, error, isLoading } = useSWR(
        `/users/${userId}/balance`,
        fetcherAuth
    );
    console.log(data);
    return {
        balance: data,
        isLoadingBalance: isLoading,
        isErrorBalance: error,
    };
}
