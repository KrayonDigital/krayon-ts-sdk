import { Pageable } from './pagination';

export enum DepositStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  UNKNOWN = 'UNKNOWN',
  CANCELLED = 'CANCELLED',
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
  currency: string;
  logo: string;
  created_at: string;
  gross_payment: string;
  payment_fee: string;
  amount: string;
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

export interface MerchantDepositBalance {
  sum_deposits: number;
  sum_withdrawals: number;
}

export type MerchantDepositsResponse = Pageable<MerchantDeposit>;
export type MerchantDepositBalanceResponse = {
  data: MerchantDepositBalance;
};
