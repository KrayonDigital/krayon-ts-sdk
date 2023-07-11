import { KrayonAPIClient } from 'sdk/api-client';
import { DataWrap, KrayonAPICommonOptions } from 'sdk/types/common';
import { TradingPair, MinTradeAmount, MarketPrice, GasFee } from 'sdk/types/trade';

interface CreateTradeBody {
  ticker: string;
  side: string;
  delivered_amount: number;
  strategy: string;
  wallet: string;
}

type GasFeeEstimationParams = {
  amount: string;
  blockchain: string;
  from_address: string;
  symbol: string;
  extraParams?: KrayonAPICommonOptions;
};

export class KrayonTradeSDK {
  readonly apiClient: KrayonAPIClient;

  constructor({ apiClient }: { apiClient: KrayonAPIClient }) {
    this.apiClient = apiClient;
  }

  getMarketPrice(ticker: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get(`/trades/market-price`, {
      params: { ticker },
      signal: abortSignal,
    });
  }

  // Currently not using params here, but keeping them in for consistency reasons
  // (if extraparams needs to be passed it should be the second param)
  getTradingPairs(params?: {}, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<TradingPair>('/trades/trading-pairs', {
      params,
      signal: abortSignal,
    });
  }

  getGasFeeEstimation(params: GasFeeEstimationParams, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get('/utils/estimate-tx-fee', {
      params,
      signal: abortSignal,
    });
  }

  // Currently not using params here, but keeping them in for consistency reasons
  // (if extraparams needs to be passed it should be the second param)
  getMinTradeAmount(params?: {}, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<DataWrap<MinTradeAmount>>('/trades/min-trade-amounts', {
      params,
      signal: abortSignal,
    });
  }

  createTrade(tradeBody: CreateTradeBody, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post<DataWrap<unknown>>('/trades', tradeBody, {
      signal: abortSignal,
    });
  }
}
