import { PaginationRequest } from './common';
import { DepositStatus } from './deposit';
import { Pageable } from './pagination';

export interface MerchantNotification {
  id: string;
  created_at: string;
  delivery_status: DepositStatus;
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

export type NotificationsFilter = PaginationRequest & {
  status?: string;
  type?: string;
  id?: string;
};

export type MerchantNotificationResponse = Pageable<MerchantNotification>;
