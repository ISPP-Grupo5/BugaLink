import { useNotificationStore } from '@/stores/notifications';
import { useEffect, useRef } from 'react';
import { Toaster, toast } from 'sonner';

const TOAST_METHODS = {
  success: toast.success,
  error: toast.error,
  warning: toast.error,
  info: toast,
  default: toast,
};

export const NotificationManager = () => {
  const { notifications, dismissNotification } = useNotificationStore();
  const lastNotification = useRef(null);

  useEffect(() => {
    const newNotifications = notifications.filter(
      (n) => !lastNotification.current || n.id > lastNotification.current.id
    );

    newNotifications.forEach((notification) => {
      const { type, message } = notification;
      const toastMethod = TOAST_METHODS[type] || TOAST_METHODS.default;
      toastMethod(message, {
        onDismiss: () => dismissNotification(notification.message),
        onAutoClose: () => dismissNotification(notification.message),
      });
    });

    if (newNotifications.length > 0) {
      lastNotification.current = newNotifications[newNotifications.length - 1];
    }
  }, [notifications, dismissNotification]);

  return <Toaster richColors position="top-center" />;
};
