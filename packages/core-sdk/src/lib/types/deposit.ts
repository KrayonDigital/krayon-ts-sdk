import { Pageable } from './pagination';

export enum DepositStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  UNKNOWN = 'UNKNOWN',
}

export const DepositStatusName = new Map([
  [DepositStatus.ERROR, 'Error'],
  [DepositStatus.SUCCESS, 'Success'],
  [DepositStatus.UNKNOWN, 'Unknown'],
]);

export interface MerchantDeposit {
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
}

export type MerchantDepositsResponse = Pageable<MerchantDeposit>;
