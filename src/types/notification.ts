export enum NotificationType {
  NEW_ORDER = 'NEW_ORDER',
  ORDER_UPDATED = 'ORDER_UPDATED',
  ORDER_CANCELLED = 'ORDER_CANCELLED'
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  orderId: number | null;
  orderCode: string | null;
  createdAt: string;
  updatedAt: string;
}
