import { User } from 'next-auth';
import { useCallback, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

export default function useChatSocket(chatId: string | number, user: User) {
  const getSocketUrl = useCallback(() => {
    return new Promise<string>((resolve) => {
      if (user?.access && chatId) {
        // TODO: use env variable for backend url and check that it works
        if (process.env.NODE_ENV === 'production') {
          resolve(`wss://app.bugalink.es/ws/chat/${chatId}/?token=${user.access}`);
        } else {
          resolve(`ws://localhost:8000/ws/chat/${chatId}/?token=${user.access}`);
        }

      }
    });
  }, [chatId, user]);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(getSocketUrl);
  const [messageHistory, setMessageHistory] = useState([]);

  useEffect(() => {
    if (lastJsonMessage !== null && !messageHistory.includes(lastJsonMessage)) {
      setMessageHistory((prev) => [lastJsonMessage, ...prev]);
    }
  }, [lastJsonMessage, setMessageHistory]);

  return { messageHistory, sendJsonMessage };
}
