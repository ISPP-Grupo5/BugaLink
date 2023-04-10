import DriverPreferencesI from '@/interfaces/driverPreferences';
import { axiosAuth } from '@/lib/axios';
import { useEffect, useState } from 'react';

export default function useDriverPreferences(
  driverId: string | number | undefined
) {
  const [driverPreferences, setDriverPreferences] =
    useState<DriverPreferencesI>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!driverId) return;
    const fetchUserStats = async () => {
      try {
        const response = await axiosAuth.get(
          `/drivers/${driverId}/preferences`
        );
        const { data } = response;
        setDriverPreferences(data);
        setIsLoading(false);
      } catch (error) {
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchUserStats();
  }, [driverId]);

  return {
    preferences: driverPreferences,
    isLoadingPreferences: isLoading,
    isErrorPreferences: isError,
  };
}
