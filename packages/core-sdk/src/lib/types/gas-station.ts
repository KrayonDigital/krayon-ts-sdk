import { Wallet } from './wallet';

export interface GasStationDto extends Wallet {
  balance_cap: number;
  red_marker: number;
  max_network_fee: number;
  gas_station_status: number;
  balance: string;
  assets: GasStationAssets[];
  symbol: string;
  data?: any;
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
export interface AddGasStation {
  id?: string;
  name?: string;
  blockchain: string;
  group?: string;
  balance_cap: number;
  max_network_fee: number;
  red_marker: number;
}
export interface GasStationsItem {
  id: string;
  address: string;
  blockchain: string;
  total_usd_balance: string;
  balance_cap: number;
  red_marker: number;
  max_network_fee: number;
  assets: GasStationAssets[];
};
