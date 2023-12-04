import { PaginationRequest } from './common';
import { Pageable } from './pagination';

export interface Settlement {
  id: string;
  status: SettlementStatus;
  created_at: string;
  symbol: string;
  amount: string;
  wallet: string;
  description: string;
  type: string;

  address: string;
  blockchain: string;
  currency: string;
  exchange_rate: string;
  settled_amount: string;
}

export enum SettlementStatus {
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export const SettlementStatusName = new Map([
  [SettlementStatus.SUCCESS, 'Success'],
  [SettlementStatus.PENDING, 'Pending'],
  [SettlementStatus.FAILED, 'Failed'],
  [SettlementStatus.CANCELLED, 'Canceled'],
  [SettlementStatus.EXPIRED, 'Expired'],
]);

export type SettlementsFilter = PaginationRequest & {
  date_from?: string;
  date_to?: string;
  status?: string;
  type?: string;
  country?: string;
  id?: string;
  email?: string;
};

export type MerchantSettlementsResponse = Pageable<Settlement>;
