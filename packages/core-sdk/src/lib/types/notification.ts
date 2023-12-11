import { PaginationRequest } from './common';
import { Pageable } from './pagination';

export interface MerchantNotification {
  id: string;
  created_at: string;
  delivery_status: NotificationStatus;
  delivery_error_message: string;
  related_object_details: MerchantNotificationDeposit | any;
}

export interface MerchantNotificationDeposit {
  id: string;
  organization: string;
  wallet: string;
  status: string;
  amount: number;
  currency: string;
  symbol: string;
  webhook_url: string;
  type: string;
}

export enum NotificationStatus {
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  REJECTED = 'REJECTED',
  ERROR = 'ERROR',
}

export const NotificationStatusName = new Map([
  [NotificationStatus.ERROR, 'Error'],
  [NotificationStatus.SUCCESS, 'Success'],
  [NotificationStatus.CANCELLED, 'Canceled'],
  [NotificationStatus.EXPIRED, 'Expired'],
  [NotificationStatus.PENDING, 'Pending'],
  [NotificationStatus.REJECTED, 'Rejected'],
]);

export type NotificationsFilter = PaginationRequest & {
  status?: string;
  type?: string;
  id?: string;
};

export type MerchantNotificationResponse = Pageable<MerchantNotification>;
