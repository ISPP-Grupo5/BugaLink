import Avatar from '@/components/avatar';
import { BackButton } from '@/components/buttons/Back';
import AnimatedLayout from '@/components/layouts/animated';
import NEXT_ROUTES from '@/constants/nextRoutes';
import useChatSocket from '@/hooks/useChatSocket';
import useConversation from '@/hooks/useConversation';
import ConversationI from '@/interfaces/conversation';
import MessageI from '@/interfaces/message';
import { shortenName } from '@/utils/formatters';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Arrow from 'public/assets/arrow-right.svg';
import OriginPin from 'public/assets/origen-pin.svg';
import { useState } from 'react';
import DestinationPin from '/public/assets/map-pin.svg';
import { createMessageSeparator } from '@/utils/objects';

export default function Conversation() {
  const router = useRouter();
  const { data } = useSession();

  const userId = router.query.id as string;
  const user = data?.user as User;

  const { conversation, isLoading, isError } = useConversation(userId);
  const { messageHistory, sendJsonMessage, connectionStatus } = useChatSocket(
    conversation?.id,
    user
  );

  const allMessages = [...messageHistory, ...(conversation?.message_set || [])]
    // Convert the array allMessages to an object where the keys are the timestamps of each message
    // (both removes duplicates and sorts the messages by timestamp)
    .reduce(
      (acc, message) => ({ ...acc, [message.timestamp]: message }),
      {}
    ) as {
    [key: string]: MessageI;
  };

  // Every time a message and the previous one are in a different day, we add a "date separator" message.
  // It's another message, but the sender is undefined and the text is what we want to show (In this case, the
  // date of the following messages).
  const messagesSplitByDay = Object.values(allMessages).reduce(
    (acc: MessageI[], message: MessageI) => {
      // Compare the current message with the previous one
      const messageDate = new Date(message.timestamp);
      const nextMessage = acc[acc.length - 1];
      const nextMessageDate = new Date(nextMessage?.timestamp);
      if (
        nextMessage?.sender !== undefined &&
        message?.sender !== undefined &&
        nextMessageDate.getDate() !== messageDate.getDate()
      ) {
        acc.push(createMessageSeparator(nextMessageDate));
      }

      acc.push(message);
      return acc;
    },
    []
  );

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error</p>;

  return (
    <AnimatedLayout className="justify-between flex flex-col bg-white px-4">
      <ChatHeader user={user} conversation={conversation} />
      <div className="-mb-6 flex h-full max-h-full flex-col-reverse space-y-3 overflow-y-scroll py-3">
        {/* This is a bottom spacer between the most recent message bubble and the message input bar */}
        <div className="h-6 w-full">&nbsp;</div>
        {/* This is the list of messages that come from the websocket connection (real-time, happening now, updated on the fly) */}
        {messagesSplitByDay.map((message: MessageI) => (
          <MessageBubble
            key={message.id}
            message={message}
            isMine={message.sender === user.user_id}
          />
        ))}
        {messagesSplitByDay.length > 0 && (
          <InformativeChatMessage
            message={createMessageSeparator(
              new Date(
                messagesSplitByDay[messagesSplitByDay.length - 1].timestamp
              )
            )}
          />
        )}
      </div>
      <TextInput
        sendJsonMessage={sendJsonMessage}
        connectionStatus={connectionStatus}
      />
    </AnimatedLayout>
  );
}

const ChatHeader = ({
  user,
  conversation,
}: {
  user: User;
  conversation: ConversationI;
}) => {
  // We have to detect if we are the initiator or the receiver of the conversation
  const otherUser =
    conversation?.receiver.id === user?.user_id
      ? conversation.initiator
      : conversation.receiver;

  return (
    <div className="sticky -mx-4 flex flex-col bg-green px-6 py-5 text-white">
      <span className="justify-between flex">
        <span className="flex items-center space-x-2 text-xl">
          <BackButton />
          {otherUser && (
            <p>
              Chat con {shortenName(otherUser.first_name, otherUser.last_name)}
            </p>
          )}
        </span>
        <Link
          href={NEXT_ROUTES.PROFILE(otherUser.id)}
          className="flex flex-row -space-x-4"
        >
          <Avatar
            src={otherUser?.photo}
            className="h-12 w-12 outline outline-4 -outline-offset-1 outline-green"
          />
        </Link>
      </span>
      {conversation.most_recent_trip && (
        <Link
          href={NEXT_ROUTES.TRIP_DETAILS(conversation.most_recent_trip.id)}
          className="mt-4 grid grid-cols-2 gap-2"
        >
          <Entry title="Origen">
            <OriginPin className="aspect-square flex-none scale-125 text-white" />
            <p className="truncate">
              {conversation.most_recent_trip.driver_routine.origin.address}
            </p>
          </Entry>
          <Entry title="Destino">
            <DestinationPin className="aspect-square flex-none translate-y-0.5 scale-125 text-pale-green" />
            <p className="truncate">
              {conversation.most_recent_trip.driver_routine.destination.address}
            </p>
          </Entry>
        </Link>
      )}
    </div>
  );
};

const MessageBubble = ({
  message,
  isMine,
}: {
  message: MessageI;
  isMine: boolean;
}) => {
  // Messages that are not sent by any user are informative messages (e.g. "Current date")
  if (message.sender === undefined)
    return <InformativeChatMessage message={message} />;
  return (
    <div
      className={`flex w-full flex-col items-start ${
        isMine ? 'items-end' : 'items-start'
      }`}
    >
      <span className="flex flex-row items-end space-x-2">
        {!isMine && <Avatar className="h-8 w-8" />}
        <div
          className={`justify-between flex max-w-xs flex-row items-center rounded-2xl py-2 px-3 ${
            isMine
              ? 'rounded-br-none bg-pale-green'
              : 'rounded-bl-none bg-light-gray'
          }`}
          style={{
            wordBreak: 'break-word',
          }}
        >
          <p
            className="hyphens-auto flex-wrap whitespace-pre-line text-lg font-medium text-black"
            lang="es"
          >
            {message.text}
          </p>
          {message.timestamp && (
            <p className="ml-2 flex-none place-self-end pb-0.5 text-xs text-gray">
              {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
        </div>
        {isMine &&
          (message.read_by_recipient ? <DoubleCheckMark /> : <CheckMark />)}
      </span>
    </div>
  );
};

const InformativeChatMessage = ({ message }: { message: MessageI }) => {
  return (
    <div className="flex w-full flex-col items-center">
      <p className="text-xs text-gray">{message.text}</p>
    </div>
  );
};

const TextInput = ({ sendJsonMessage, connectionStatus }) => {
  const handleSubmitMessage = () => {
    const trimmedMessage = message.trim().substring(0, 2000);
    // Messages are limited to 2000 chars in the backend
    if (trimmedMessage.length > 0) sendJsonMessage({ message: trimmedMessage });
    setMessage('');
  };

  const [message, setMessage] = useState('');

  return (
    <div className="justify-between sticky bottom-0 mb-4 flex w-full flex-row items-center rounded-full bg-light-gray p-4">
      <textarea
        className="h-8 w-full resize-none bg-transparent pl-1 pt-0.5 text-lg leading-none focus:outline-none"
        placeholder={
          connectionStatus === 'Open'
            ? 'Escribe un mensaje...'
            : 'Conectando...'
        }
        value={message}
        maxLength={2000}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) =>
          e.key == 'Enter' && !e.shiftKey && handleSubmitMessage()
        }
        disabled={connectionStatus !== 'Open'}
      />
      <button
        className="-m-2 flex aspect-square w-14 items-center justify-center rounded-full bg-green text-white"
        onClick={handleSubmitMessage}
      >
        <Arrow className="scale-150" />
      </button>
    </div>
  );
};

const Entry = ({ title, children }) => {
  return (
    <div className="flex flex-col leading-4">
      <p className="text-base font-thin text-base-origin">{title}</p>
      <div className="flex flex-row items-baseline space-x-1.5 text-lg font-medium">
        {children}
      </div>
    </div>
  );
};

export const CheckMark = () => <p className="pl-[0.62rem] text-dark-gray">✔</p>;
export const DoubleCheckMark = () => (
  <p className="-tracking-widest text-blue-select">✔✔</p>
);
