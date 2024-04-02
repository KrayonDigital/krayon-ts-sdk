import { PaymentMethod } from './deposit';

export enum CheckoutDepositStatus {
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export type PaymentDetails = {
  account_number: string;
  account_name: string;
  bank_name: string;
  type?: 'ngn_bank_transfer'; // 'ngn_bank_transfer' is the only value for now, other to be added later

}

export interface Checkout {
  organization: string;
  blockchain: string;
  symbol: string;
  logo: string;
  id: string;
  status: CheckoutDepositStatus;
  amount: string;
  currency: string;
  description: string;
  payment_method: PaymentMethod;
  return_url: string;
  qr_code: string;
  created_at: string;
  payment_details?: PaymentDetails
}

export type CheckoutResponse = { data: Checkout };
