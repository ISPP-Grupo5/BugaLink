import fetcher from '@/utils/fetcher';
import useSWR from 'swr';

export default function useNumPendingChats() {
  // TODO: once we have local sessions, we can extract the user id from the session
  // We will use the hardcoded USER_ID=1 for now
  const USER_ID = 1;

  const { data, error, isLoading } = useSWR(
    `/users/${USER_ID}/chats/pending/count`,
    fetcher
  );

  return {
    numPendingChats: data,
    isLoading,
    isError: error,
  };
}
