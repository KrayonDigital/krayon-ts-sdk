import { PaymentMethod } from './deposit';

export enum CheckoutDepositStatus {
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export interface Checkout {
  blockchain: string;
  symbol: string;
  id: string;
  status: CheckoutDepositStatus;
  amount: string;
  currency: string;
  description: string;
  payment_method: PaymentMethod;
  return_url: string;
  qr_code: string;
  created_at: string;
}

export type CheckoutResponse = { data: Checkout };
