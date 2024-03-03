import { Pageable } from './pagination';

export interface Asset {
  id: string;
  wallet_parent: string;
  wallet: string;
  pending_balance: string;
  pending_usd_balance: string;
  usd_balance: string;
  symbol: string;
  blockchain: string;
  name: string;
  decimals: number;
  logo: string;
  balance: string;
}

export type AssetResponse = Pageable<Asset>;
