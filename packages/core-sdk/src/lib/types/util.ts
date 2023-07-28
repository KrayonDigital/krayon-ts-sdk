import { DataWrap } from './common';

export type Coin = 'ETH' | 'WETH' | 'BTC' | 'XTZ' | string;
export type TimeInterval = 'hour' | 'day' | 'week' | 'month' | 'onetime';

export interface Link {
  url: string;
  name: string;
}

export interface Blockchain {
  id: string;
  created_at: string;
  updated_at: string;
  blockchain: string;
  name: string;
  website: string;
  description: string;
  explorer: string;
  research: string;
  symbol: string;
  type: string;
  decimals: number;
  logo_uri: string;
  status: string;
  links: Link[];
  test_net: boolean;
  swap: boolean;
}

export type BlockchainListResponse = DataWrap<{[key: string]: Blockchain}>;

export interface EstimateTransactionFeeDTO {
  estimated_fee: number;
  estimated_fee_usd: number;
  total_fee_usd: number;
  symbol: string;
  error: string;
}


export type EstimateTransactionFeeResponse = DataWrap<EstimateTransactionFeeDTO>;

export type CoinPriceDto = { data: Record<string, number> };

export interface CoinTypesResponse {
  data: {
    coins: {
      [key: string]: string;
    };
  };
}

export type FetchCoinPriceParams = { symbol: Coin; };

export type DecodeContractInteractionParams = { blockchain: string; address: string; tx_data: string };
export type DecodedContractInteraction = {
  name: string;
  arguments: {
    name: string;
    type: string;
    value: string;
  }[];
  selector: string;
  signature: string;
  function_abi: {
    name: string;
    type: string;
    inputs: {
      name: string;
      type: string;
      internalType?: string;
    }[];
    outputs: any[]; // Replace 'any' with the appropriate type if known
    stateMutability: string;
  };
};

export type DecodeContractInteractionResponse = DataWrap<DecodedContractInteraction>;
