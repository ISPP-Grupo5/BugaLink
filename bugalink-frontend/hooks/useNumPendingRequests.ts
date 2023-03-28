export default function useNumPendingRequests() {
  // TODO: implement when we have the backend endpoint
  // const userId = useAuth().userId;
  // const { data, error, isLoading } = useSWR(
  //   `/users/${userId}/requests/pending/count`,
  //   fetcher
  // );

  // return {
  //   numPendingRequests: data,
  //   isLoading,
  //   isError: error,
  // };
  return {
    useNumPendingRequests: 0,
    isLoading: false,
    isError: false,
  };
}
