import { BlockchainTitle } from "./blockchain-types";

export interface GasStationDto {
  data?: any;
  name?: string;
  blockchain: BlockchainTitle;
  organization?: string;
  group?: string;
  balance_cap?: number | string;
  red_marker?: number | string;
  max_network_fee?: number | string;
  id?: string;
  address?: string;
  description?: string;
  gas_station_status?: number;
  image?: string;
  balance?: string;
  pending_usd_balance?: number;
  total_usd_balance?: string;
  symbol?: string;
  assets?: GasStationAssets[];
}
export interface GasStationAssets {
  balance: string;
  blockchain: string;
  decimals?: number;
  id?: string;
  logo?: string;
  name?: string;
  pending_balance?: string;
  pending_usd_balance?: string;
  symbol: string;
  usd_balance: string;
  wallet?: string;
}
