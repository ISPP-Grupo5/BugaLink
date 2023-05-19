import Avatar from '@/components/avatar';
import { BackButtonText } from '@/components/buttons/Back';
import InformativeCard from '@/components/cards/informative';
import AnimatedLayout from '@/components/layouts/animated';
import NEXT_ROUTES from '@/constants/nextRoutes';
import useConversationList from '@/hooks/useConversationList';
import ConversationPreviewI from '@/interfaces/conversationPreview';
import { shortenName } from '@/utils/formatters';
import cn from 'classnames';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { CheckMark, DoubleCheckMark } from '../users/[id]/chat';

export default function ConversationList() {
  const { conversations, isLoading, isError } = useConversationList();
  const authUser = useSession().data?.user as User;

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error</p>;

  return (
    <AnimatedLayout className="flex flex-col justify-start bg-white px-4">
      <BackButtonText text="Mis conversaciones" />
      <div className="flex flex-col-reverse space-y-6 space-y-reverse overflow-y-scroll py-3">
        {conversations.map((conversation: ConversationPreviewI) => (
          <ConversationListItem
            key={conversation.initiator.email + conversation.receiver.email}
            authUser={authUser}
            conversation={conversation}
          />
        ))}
        {conversations.length === 0 && (
          <InformativeCard>Todavía no tienes conversaciones</InformativeCard>
        )}
      </div>
    </AnimatedLayout>
  );
}

const ConversationListItem = ({ conversation, authUser }) => {
  const { initiator, receiver, last_message, unread_messages_count } =
    conversation as ConversationPreviewI;

  const hasUnreadMessages = unread_messages_count > 0;

  // Get who is the user who i'm chatting with (the one we want to display)
  const otherUser = initiator?.id === authUser?.user_id ? receiver : initiator;
  const lastMessageWasMine = last_message?.sender === authUser?.user_id;

  return (
    <Link
      className="flex w-full justify-between space-x-3"
      href={NEXT_ROUTES.CHAT(otherUser.id)}
    >
      <span className="flex w-5/6 space-x-3">
        <Avatar className="h-16 w-16" src={otherUser.photo} />
        <div
          className={cn(
            {
              'font-semibold text-black':
                last_message &&
                !last_message.read_by_recipient &&
                !lastMessageWasMine,
            },
            'flex flex-col truncate leading-3'
          )}
        >
          <p className="truncate text-xl font-semibold">
            {shortenName(otherUser.first_name, otherUser.last_name)}
          </p>
          <p className="truncate text-lg">
            {`${lastMessageWasMine ? 'Yo:' : ''} ${
              last_message?.text || 'Todavía no hay mensajes'
            }`}
          </p>
        </div>
      </span>

      {last_message && (
        <p
          className={cn(
            { hasUnreadMessages: 'font-bold' },
            'flex flex-col items-end text-gray'
          )}
        >
          {new Date(last_message.timestamp).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          {!lastMessageWasMine && hasUnreadMessages && (
            <span className="flex aspect-square w-8 items-center justify-center rounded-full bg-light-red text-center font-semibold text-white">
              {unread_messages_count}
            </span>
          )}
          {lastMessageWasMine &&
            (last_message.read_by_recipient ? (
              <DoubleCheckMark />
            ) : (
              <CheckMark />
            ))}
        </p>
      )}
    </Link>
  );
};
