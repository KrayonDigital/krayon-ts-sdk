import { Coin } from 'sdk/types/wallet';
import { DataWrap } from './common';

export interface BlockchainListResponse {
  data: {
    native: Record<string, string>;
    trading: string[];
  };
}

export interface EstimateTransactionFeeResponse {
  data: {
    estimated_fee: number;
    symbol: string;
    error: string;
  };
}

export type CoinPriceDto = { data: Record<string, number> };

export interface CoinTypesResponse {
  data: {
    coins: {
      [key: string]: string;
    };
  };
}

export type FetchCoinPriceParams = { symbol: Coin; blockchain: string };

export type DecodeContractInteractionParams = { blockchain: string; address: string, tx_data: string }
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
