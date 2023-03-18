import useNumPendingChats from '@/hooks/useNumPendingChats';
import SquareButton from '..';
import Chat from '/public/icons/Vista-Principal/chat.svg';

export default function SquareChatsButton() {
  const { numPendingChats } = useNumPendingChats();

  return (
    <SquareButton
      text="Chats"
      link="#"
      Icon={<Chat className="translate-x-0.5 translate-y-0.5" />}
      numNotifications={numPendingChats || 0}
    />
  );
}
