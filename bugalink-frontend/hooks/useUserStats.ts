import UserStatsI from '@/interfaces/userStats';
import { axiosAuth } from '@/lib/axios';
import { useEffect, useState } from 'react';

export default function useUserStats(id: any) {
  const [userStats, setUserStats] = useState<UserStatsI>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchUserStats = async () => {
      try {
        const response = await axiosAuth.get(`/users/${id}/stats`);
        const { data } = response;
        setUserStats(data);
        setIsLoading(false);
      } catch (error) {
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchUserStats();
  }, [id]);

  return { userStats, isLoadingStats: isLoading, isErrorStats: isError };
}
