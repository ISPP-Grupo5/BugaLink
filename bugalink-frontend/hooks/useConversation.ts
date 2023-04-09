import ConversationI from '@/interfaces/conversation';
import { axiosAuth } from '@/lib/axios';
import { useEffect, useState } from 'react';

export default function useConversation(userId: string | undefined) {
  const [conversation, setConversation] = useState<ConversationI>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const fetchConversation = async () => {
      try {
        const response = await axiosAuth.get(`/users/${userId}/conversation/`);
        const { data } = response;
        setConversation(data);
        setIsLoading(false);
      } catch (error) {
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchConversation();
  }, [userId]);

  return { conversation, isLoading, isError };
}
