import ConversationPreviewI from '@/interfaces/conversationPreview';
import { fetcherAuth } from '@/utils/fetcher';
import useSWR from 'swr';

export default function useConversationList() {
  const { data, error, isLoading } = useSWR(`/conversations/`, fetcherAuth);

  return {
    conversations: data as ConversationPreviewI[],
    isLoading,
    isError: error,
  };
}
