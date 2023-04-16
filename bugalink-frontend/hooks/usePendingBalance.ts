import { fetcherAuth } from "@/utils/fetcher";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import useSWR from 'swr';

export default function usePendingBalance() {
    const user = useSession().data?.user as User;
    const { data, error, isLoading } = useSWR(
        user && `/users/${user.user_id}/transactions/get_pending_balance`,
        fetcherAuth
    );
    return {
        pendingBalance: data as string,
        isLoadingPendingBalance: isLoading,
        isErrorPendingBalance: error,
    };
}