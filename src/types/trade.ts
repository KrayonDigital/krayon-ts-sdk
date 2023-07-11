import { DataWrap } from "./common";

export type TradingPair = DataWrap<string[]>;

export interface MinTradeAmount {
  [blockchain: string]: string;
}

export interface MarketPrice {
  best_ask: number;
  best_bid: number;
  data_type: string;
  last_updated: number;
  precision: number[];
  spread: number;
  symbol: string;
}

export interface GasFee {
  estimated_fee: number;
  symbol: string;
}
