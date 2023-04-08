import ConversationI from '@/interfaces/conversation';
import { axiosAuth } from '@/lib/axios';
import { useEffect, useState } from 'react';

export default function useConversation(id: string | undefined) {
  const [conversation, setConversation] = useState<ConversationI>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchConversation = async () => {
      try {
        const response = await axiosAuth.get(`/conversations/${id}/`);
        const { data } = response;
        setConversation(data);
        setIsLoading(false);
      } catch (error) {
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchConversation();
  }, [id]);

  return { conversation, isLoading, isError };
}
