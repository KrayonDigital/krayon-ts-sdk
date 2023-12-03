import { PaginationRequest } from './common';
import { DepositStatus } from './deposit';
import { Pageable } from './pagination';

export interface Settlement {
  id: string;
  status: DepositStatus;
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
