import { NotificationRedirectTypes } from "../constants/NotificationRedirectTypes";
export interface NotificationType {
  id: string;
  title: string;
  message: string;
  redirectType: keyof typeof NotificationRedirectTypes;
  redirectContent: string;
  type: string | null;
  timestamp: number;
  markAsRead: boolean;
  recipientId: string;
}
