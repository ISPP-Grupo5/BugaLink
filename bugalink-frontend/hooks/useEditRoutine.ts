import fetcher from "@/utils/fetcher";
import useSWR from 'swr';

export default function useEditRoutine()  {
    const USER_ID = 1;
    const routineId = 1;
    const { data, error, isLoading } = useSWR(`users/${USER_ID}/routines/driver/${routineId}`, fetcher);
  
      return {
        routine: data,
        isLoading,
        isError: error,
      };
  }