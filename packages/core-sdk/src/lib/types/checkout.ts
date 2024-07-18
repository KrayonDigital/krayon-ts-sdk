import { PaymentMethod } from './deposit';

export enum CheckoutDepositStatus {
  SUCCESS = 'SUCCESS',
  SUBMITED = 'SUBMITED',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export type PaymentDetails = {
  account_number: string;
  account_name: string;
  bank_name: string;
  type?:
    | 'NGN_bank_transfer'
    | 'ZAR_bank_transfer'
    | 'GHS_bank_transfer'
    | 'KES_bank_transfer';
  reference?: string;
};

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
  payment_details?: PaymentDetails | null;
  destination_vpa?: string;
  extra_qr_code?: Record<string, string>;
}

export type CheckoutResponse = { data: Checkout };
