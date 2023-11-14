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
}

export interface MerchantNotification {
  id: string;

  organization: string;
  wallet: string;
  status: string;
  amount: number;
  currency: string;
  symbol: string;
  webhook_url: string;

  date: string;
  request: string;
  response: string;
}

export type MerchantDepositsResponse = Pageable<MerchantDeposit>;
export type MerchantNotificationResponse = Pageable<MerchantNotification>;
