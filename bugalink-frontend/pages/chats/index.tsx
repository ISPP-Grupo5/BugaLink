import Avatar from '@/components/avatar';
import { BackButtonText } from '@/components/buttons/Back';
import AnimatedLayout from '@/components/layouts/animated';
import NEXT_ROUTES from '@/constants/nextRoutes';
import useConversationList from '@/hooks/useConversationList';
import ConversationPreviewI from '@/interfaces/conversationPreview';
import { shortenName } from '@/utils/formatters';
import Link from 'next/link';

export default function ConversationList() {
  const { conversations, isLoading, isError } = useConversationList();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error</p>;

  return (
    <AnimatedLayout className="flex flex-col justify-start bg-white px-4">
      <BackButtonText text="Mis conversaciones" />
      <div className="flex flex-col space-y-6 overflow-y-scroll py-3">
        {conversations.map((conversation: ConversationPreviewI) => (
          <ConversationListItem
            key={conversation.initiator.email + conversation.receiver.email}
            conversation={conversation}
          />
        ))}
      </div>
    </AnimatedLayout>
  );
}

const ConversationListItem = ({ conversation }) => {
  const { id, receiver, last_message } = conversation as ConversationPreviewI;

  return (
    <Link
      href={NEXT_ROUTES.CHAT(id)}
      className="flex w-full flex-row items-start justify-between space-x-3"
    >
      <span className="flex space-x-3">
        <Avatar className="h-16 w-16" src={receiver.photo} />
        <div className="flex flex-col leading-4">
          <p className="truncate text-xl font-semibold">
            {shortenName(receiver.first_name, receiver.last_name)}
          </p>
          <p className="text-lg text-gray">
            {last_message?.text || 'Todavía no hay mensajes'}
          </p>
        </div>
      </span>

      {last_message && (
        <p className="text-gray">
          {new Date(last_message.timestamp).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      )}
    </Link>
  );
};
