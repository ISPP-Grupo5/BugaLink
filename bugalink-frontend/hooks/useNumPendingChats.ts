export default function useNumPendingChats() {
  // const userId = useAuth().userId;

  // TODO: implement when we have the backend endpoint
  // const { data, error, isLoading } = useSWR(
  //   `/users/${userId}/chats/pending/count`,
  //   fetcher
  // );

  // return {
  //   numPendingChats: data,
  //   isLoading,
  //   isError: error,
  // };

  return {
    numPendingChats: 0,
    isLoading: false,
    isError: false,
  };
}
