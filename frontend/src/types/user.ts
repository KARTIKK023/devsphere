export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  isOnline?: boolean;
  notificationCount?: number;
};