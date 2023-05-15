import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Notification } from '@/interfaces/notification';

type NotificationsStore = {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  dismissNotification: (id: string) => void;
};

const notificationsStore = (set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { id: Date.now(), ...notification },
      ],
    })),

  dismissNotification: (message) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.message !== message
      ),
    })),
});

export const useNotificationStore = create(
  devtools<NotificationsStore>(notificationsStore)
);
