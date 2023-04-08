import Avatar from '@/components/avatar';
import { BackButton } from '@/components/buttons/Back';
import AnimatedLayout from '@/components/layouts/animated';
import useChatSocket from '@/hooks/useChatSocket';
import useConversation from '@/hooks/useConversation';
import MessageI from '@/interfaces/message';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Arrow from 'public/assets/arrow-right.svg';
import OriginPin from 'public/assets/origen-pin.svg';
import { useState } from 'react';
import DestinationPin from '/public/assets/map-pin.svg';

export default function Conversation() {
  const chatId = useRouter().query.id as string;
  const { data } = useSession();

  const user = data?.user as User;

  const { conversation, isLoading, isError } = useConversation(chatId);
  const { messageHistory, sendJsonMessage } = useChatSocket(chatId, user);

  const allMessages = [...messageHistory, ...(conversation?.message_set || [])];

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error</p>;

  return (
    <AnimatedLayout className="flex flex-col justify-between bg-white px-4">
      <ChatHeader />
      <div className="-mb-6 flex h-full max-h-full flex-col-reverse space-y-3 overflow-y-scroll py-3">
        {/* This is a bottom spacer between the most recent message bubble and the message input bar */}
        <div className="h-6 w-full">&nbsp;</div>{' '}
        {/* This is the list of messages that come from the websocket connection (real-time, happening now, updated on the fly) */}
        {allMessages.map((message: MessageI) => (
          <MessageBubble
            key={message.id}
            message={message}
            isMine={message.sender === user.user_id}
          />
        ))}
      </div>
      <TextInput sendJsonMessage={sendJsonMessage} />
    </AnimatedLayout>
  );
}

const ChatHeader = () => {
  return (
    <div className="sticky -mx-4 flex flex-col bg-green px-6 py-8 text-white">
      <span className="mb-4 flex justify-between">
        <span className="flex items-center space-x-2 text-xl">
          <BackButton />
          <p>Chat con...</p>
        </span>
        <span className="flex flex-row -space-x-4">
          {[1, 2, 3].map((i, index) => (
            <Avatar
              key={i}
              style={{ zIndex: 3 - index }}
              className="h-9 w-9 outline outline-4 -outline-offset-1 outline-green"
            />
          ))}
        </span>
      </span>
      <span className="grid grid-cols-2 gap-2">
        <Entry title="Origen">
          <OriginPin className="aspect-square flex-none scale-125 text-white" />
          <p className="truncate">Plaza de Armas</p>
        </Entry>
        <Entry title="Destino">
          {/* Origin svg */}
          <DestinationPin className="aspect-square flex-none translate-y-0.5 scale-125 text-pale-green" />
          <p className="truncate">Centro comercial Lagoh</p>
        </Entry>
      </span>
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
  return (
    <div
      className={`flex w-full flex-col items-start ${
        isMine ? 'items-end' : 'items-start'
      }`}
    >
      <span className="flex flex-row items-end space-x-2">
        {!isMine && <Avatar className="h-8 w-8" />}
        <div
          className={`flex max-w-xs flex-row items-center rounded-2xl py-2 px-3 ${
            isMine
              ? 'rounded-br-none bg-pale-green'
              : 'rounded-bl-none bg-light-gray'
          }`}
        >
          <p
            className="hyphens-auto overflow-hidden text-ellipsis text-lg font-medium text-black"
            lang="es"
          >
            {message.text}
          </p>
        </div>
      </span>
    </div>
  );
};

const TextInput = ({ sendJsonMessage }) => {
  const handleSubmitMessage = () => {
    if (message.length === 0) return;
    sendJsonMessage({ message });
    setMessage('');
  };

  const handlePressEnter = (e) => {
    if (e.keyCode == 13 && !e.shiftKey) {
      e.preventDefault();
      handleSubmitMessage();
    }
  };

  const [message, setMessage] = useState('');

  return (
    <div className="sticky bottom-0 mb-4 flex w-full flex-row items-center justify-between rounded-full bg-light-gray p-4">
      <textarea
        className="h-8 w-full resize-none bg-transparent pl-1 pt-0.5 text-lg focus:outline-none"
        placeholder="Escribe un mensaje..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handlePressEnter} // Allow sending messages with the enter key
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
