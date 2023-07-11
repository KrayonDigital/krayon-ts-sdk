import { Wallet } from 'sdk/types/wallet';
import { Asset } from 'sdk/types/asset';
import { KrayonAPICommonOptions } from 'sdk/types/common';
import { KrayonSDK } from 'sdk/main';
import { KrayonAPIClient } from 'sdk/api-client';

export class KrayonAssetSDK {
  readonly apiClient: KrayonAPIClient;

  constructor({ apiClient }: { apiClient: KrayonSDK['apiClient'] }) {
    this.apiClient = apiClient;
    // when we remove /organizations/orgid/ we can remove this dep
  }

  getAsset(assetId?: string, options?: KrayonAPICommonOptions) {
    const { abortSignal } = options || {};

    return this.apiClient.get<Asset>(`/assets/${assetId}`, {
      signal: abortSignal,
    });
  }

  getWallet(assetId: string, options?: KrayonAPICommonOptions) {
    const { abortSignal } = options || {};
    return this.apiClient.get<{ data: Wallet }>(`/assets/${assetId}/wallet`, {
      signal: abortSignal,
    });
  }
}
