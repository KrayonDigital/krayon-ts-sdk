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

  getDeposits(
    params?: SettlementsFilter,
    extraParams?: KrayonAPICommonOptions
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<MerchantDepositsResponse>(`/deposits`, {
      params,
      signal: abortSignal,
    });
  }

  getDepositBalances(
    params?: FetchDepositBalanceParams,
    extraParams?: KrayonAPICommonOptions
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<MerchantDepositBalanceResponse>(
      `/deposits/balance`,
      {
        params,
        signal: abortSignal,
      }
    );
  }
}
