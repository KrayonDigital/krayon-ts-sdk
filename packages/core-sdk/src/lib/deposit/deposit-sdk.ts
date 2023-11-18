import { KrayonAPIClient } from '../api-client';
import { KrayonSDK } from '../main';
import { KrayonAPICommonOptions, MerchantDepositsResponse } from '../types';

export class KrayonDepositSDK {
  readonly apiClient: KrayonAPIClient;

  constructor({ apiClient }: { apiClient: KrayonSDK['apiClient'] }) {
    this.apiClient = apiClient;
  }

  getDeposits(extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<MerchantDepositsResponse>(`/deposits`, {
      signal: abortSignal,
    });
  }
}
