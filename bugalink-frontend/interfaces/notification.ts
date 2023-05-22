export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
};
