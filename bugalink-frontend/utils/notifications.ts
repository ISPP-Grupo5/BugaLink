import { useNotificationStore } from '@/stores/notifications';
import { Notification } from '@/interfaces/notification';

const emitNotification = (type = 'error', title = 'Error', message = '') => {
  useNotificationStore.getState().addNotification({
    type,
    title,
    message,
  } as Notification);
};

const emitError = ({ title = 'Error', message = '' }) => {
  emitNotification('error', title, message);
};

const emitWarning = ({ title = 'warning', message = '' }) => {
  emitNotification('warning', title, message);
};

const emitInfo = ({ title = 'info', message = '' }) => {
  emitNotification('info', title, message);
};

const emitSuccess = ({ title = 'success', message = '' }) => {
  emitNotification('success', title, message);
};

export { emitError, emitWarning, emitInfo, emitSuccess };
