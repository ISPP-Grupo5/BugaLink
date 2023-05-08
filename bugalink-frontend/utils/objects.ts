import MessageI from '@/interfaces/message';

export const createMessageSeparator = (date: Date): MessageI => ({
  // Timestamp for the date separator message is the timestamp
  // of the previous message minus 1 to avoid id collisions
  id: date.getTime() - 1,
  sender: undefined,
  text: date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
  timestamp: date.setHours(0, 0, 0, 0).toString(),
  attachment: null,
  read_by_recipient: true,
});
