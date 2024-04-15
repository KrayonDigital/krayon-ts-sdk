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
  type?: 'NGN_bank_transfer' | 'ZAR_bank_transfer' | 'GHS_bank_transfer';

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
