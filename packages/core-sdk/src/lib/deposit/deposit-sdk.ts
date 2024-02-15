import { KrayonAPIClient } from '../api-client';
import { KrayonSDK } from '../main';
import {
  FetchDepositBalanceParams,
  DepositsFilter,
  KrayonAPICommonOptions,
  MerchantDepositBalanceResponse,
  MerchantDepositsResponse,
  SettlementsFilter,
} from '../types';

export class KrayonDepositSDK {
  readonly apiClient: KrayonAPIClient;

  constructor({ apiClient }: { apiClient: KrayonSDK['apiClient'] }) {
    this.apiClient = apiClient;
  }

  getSupportedBlockchains(extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get(`/deposits/supported-blockchains`);
  }

  getDeposits(
    params?: SettlementsFilter,
    extraParams?: KrayonAPICommonOptions,
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<MerchantDepositsResponse>(`/deposits`, {
      params,
      signal: abortSignal,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  }

  getDepositBalances(
    params?: FetchDepositBalanceParams,
    extraParams?: KrayonAPICommonOptions,
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<MerchantDepositBalanceResponse>(
      `/deposits/balance`,
      {
        params,
        signal: abortSignal,
        paramsSerializer: {
          indexes: null, // by default: false
        },
      },
    );
  }

  downloadDeposits(params?: any, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<string>(`/deposits/download-csv`, {
      params,
      signal: abortSignal,
    });
  }
}
