import { KrayonSDK } from '../main';
import { DataWrap } from '../types/common';
import {
  BlockchainListResponse,
  CoinPriceDto,
  CoinTypesResponse,
  EstimateTransactionFeeResponse,
  FetchCoinPriceParams,
  DecodeContractInteractionParams,
  DecodeContractInteractionResponse,
} from '../types/util';
import { KrayonAPIClient } from '../api-client';

export class KrayonUtilSDK {
  readonly apiClient: KrayonAPIClient;

  constructor({ apiClient }: { apiClient: KrayonSDK['apiClient'] }) {
    this.apiClient = apiClient;
  }

  getSupportedBlockchains() {
    return this.apiClient.get<BlockchainListResponse>('/utils/supported-blockchains');
  }

  getGasPrice(blockchain: string) {
    return this.apiClient.get<DataWrap<{ gas_price: number }>>(`/utils/gas-price`, { params: { blockchain } });
  }

  estimateTransactionFee(params: {
    amount: string;
    blockchain: string;
    from_address: string;
    symbol: string;
    token_id?: string;
  }) {
    return this.apiClient.get<EstimateTransactionFeeResponse>(`/utils/estimate-tx-fee`, { params });
  }

  async fetchCoinPrice(params: FetchCoinPriceParams) {
    const { symbol } = params;
    const response = await this.apiClient.get<CoinPriceDto>('/utils/symbol-price', {
      params: { symbols: `${symbol}` },
    });
    return symbol in response.data.data ? response.data.data[symbol] : '';
  }

  getSupportedCoins() {
    return this.apiClient.get<CoinTypesResponse>('/utils/supported-coins');
  }

  decodeContractInteraction(params: DecodeContractInteractionParams) {
    return this.apiClient.post<DecodeContractInteractionResponse>('/utils/contract-decoder', params);
  }
}
