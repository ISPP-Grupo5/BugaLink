import MessageI from '@/interfaces/message';
import { User } from 'next-auth';
import { useCallback, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export default function useChatSocket(chatId: string | number, user: User) {
  const getSocketUrl = useCallback(() => {
    return new Promise<string>((resolve) => {
      if (user?.access && chatId) {
        // TODO: use env variable for backend url and check that it works
        if (process.env.NODE_ENV === 'production') {
          resolve(
            `wss://app.bugalink.es/ws/chat/${chatId}/?token=${user.access}`
          );
        } else {
          resolve(
            `ws://localhost:8000/ws/chat/${chatId}/?token=${user.access}`
          );
        }
      }
    });
  }, [chatId, user]);

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    getSocketUrl,
    {
      shouldReconnect: () => true,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
      onMessage: (event) => {
        // Send read confirmation when I receive a message
        if (event.data) {
          const data = JSON.parse(event.data);
          const messageIsMine = data.sender === user?.user_id;
          if (!messageIsMine && data.type !== 'message_confirmation') {
            sendJsonMessage({
              type: 'read_confirmation',
              message_id: data.id,
            });
          }
        }
      },
    }
  );
  const [messageHistory, setMessageHistory] = useState([]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  useEffect(() => {
    if ((lastJsonMessage as any)?.type === 'message_confirmation') {
      const readMessages = (lastJsonMessage as any)?.read_messages;

      setMessageHistory((prev) =>
        prev.map((message) => {
          if (readMessages.includes(message.id)) {
            return { ...message, read_by_recipient: true } as MessageI;
          }
          return message;
        })
      );
    } else {
      if (
        lastJsonMessage !== null &&
        !messageHistory.some(
          (message) => message.id === (lastJsonMessage as MessageI).id
        )
      ) {
        setMessageHistory((prev) => [lastJsonMessage, ...prev]);
      }
    }
  }, [lastJsonMessage, setMessageHistory]);

  return { messageHistory, sendJsonMessage, connectionStatus };
}
