import { PaginationRequest } from './common';
import { Pageable } from './pagination';
import { Wallet } from './wallet';

export enum DepositStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  UNKNOWN = 'UNKNOWN',
  CANCELLED = 'CANCELLED',
  SUBMITTED = 'SUBMITTED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING',
}

export const DepositStatusName = new Map([
  [DepositStatus.ERROR, 'Error'],
  [DepositStatus.SUCCESS, 'Success'],
  [DepositStatus.FAILED, 'Failed'],
  [DepositStatus.UNKNOWN, 'Unknown'],
  [DepositStatus.CANCELLED, 'Canceled'],
  [DepositStatus.EXPIRED, 'Expired'],
  [DepositStatus.PENDING, 'Pending'],
  [DepositStatus.SUBMITTED, 'Submitted'],
]);

export interface MerchantDeposit {
  description: string;
  id: string;
  name: string;
  customer_country: string;
  customer_email: string;
  reference_id: string;
  currency: string;
  logo: string;
  created_at: string;
  payment_fee: string;
  net_fee: string;
  amount: string;
  net_amount: string;
  symbol: string;
  type: string;
  payment_method: string;
  qr_code: string;
  redirect_url: string;
  return_url: string;
  status: DepositStatus;
  wallet?: Wallet;
  crypto_balance?: string;
  webhook_url: string;
}

export type DepositsFilter = PaginationRequest & {
  date_from?: string;
  date_to?: string;
  status?: string;
  type?: string;
  country?: string;
  id?: string;
  email?: string;

  payment_method?: string;
  currency?: string;
  symbol?: string;
  blockchain?: string;
};

export type FetchDepositBalanceParams = {
  currency?: string;
  to_currency?: string;
  payment_method?: string;
  blockchain?: string;
  symbol?: string;
};

export interface MerchantDepositBalance {
  sum_deposits: number;
  sum_withdrawals: number;
  sum_settled_deposits: number;
  rolling_reserve: number;
  available_balance: number;
  balance: number;
  currency: string;
  symbol: string;
  payment_method: PaymentMethod;
}

export type MerchantDepositsResponse = Pageable<MerchantDeposit>;
export type MerchantDepositBalanceResponse = {
  data: MerchantDepositBalance;
};

export type PaymentMethod =
  | 'UPI'
  | 'UPI_SAP'
  | 'PAYTM'
  | 'CRYPTO'
  | 'NETBANKING'
  | 'YELLOWCARD_PIN'
  | 'MOBILE_MONEY';
