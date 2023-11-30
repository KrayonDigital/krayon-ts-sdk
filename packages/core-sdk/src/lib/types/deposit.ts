import { PaginationRequest } from './common';
import { Pageable } from './pagination';

export enum DepositStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  UNKNOWN = 'UNKNOWN',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING',
}

export const DepositStatusName = new Map([
  [DepositStatus.ERROR, 'Error'],
  [DepositStatus.SUCCESS, 'Success'],
  [DepositStatus.UNKNOWN, 'Unknown'],
  [DepositStatus.CANCELLED, 'Canceled'],
  [DepositStatus.EXPIRED, 'Expired'],
  [DepositStatus.PENDING, 'Pending'],
]);

export interface MerchantDeposit {
  description: string;
  id: string;
  name: string;
  customer_country: string;
  customer_email: string;
  currency: string;
  logo: string;
  created_at: string;
  gross_payment: string;
  payment_fee: string;
  amount: string;
  net_amount: string;
  symbol: string;
  type: string;
  payment_method: string;
  qr_code: string;
  redirect_url: string;
  return_url: string;
  status: DepositStatus;
  wallet: string;
  webhook_url: string;
}

export type DepositsFilter = PaginationRequest & {
  date_from?: string;
  date_to?: string;
  status?: string;
  type?: string;
  country: string;
  id: string;
  email: string;
};

export interface MerchantDepositBalance {
  sum_deposits: number;
  sum_withdrawals: number;
  sum_settled_deposits: number;
}

export type MerchantDepositsResponse = Pageable<MerchantDeposit>;
export type MerchantDepositBalanceResponse = {
  data: MerchantDepositBalance;
};
