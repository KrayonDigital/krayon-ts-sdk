import { Pageable } from './pagination';

export interface MerchantDeposit {
  id: string;
  name: string;
  currency: string;
  logo: string;
  date: string;
  gross_payment: string;
  payment_fee: string;
  net_amount: string;
  type: string;
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

export interface MerchantNotification {
  id: string;
  created_at: string;
  delivery_status: string;
  delivery_error_message: string;
  related_object_details: MerchantNotificationDeposit | any;
}

export type MerchantDepositsResponse = Pageable<MerchantDeposit>;
export type MerchantNotificationResponse = Pageable<MerchantNotification>;
