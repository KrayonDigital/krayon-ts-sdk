import { KrayonAPICommonOptions } from 'sdk/types/common';
import { WalletGroupFilter, WalletInWalletGroupFilter } from 'sdk/types/wallet-group';
import { WalletGroup } from 'sdk/types/wallet-group';
import { KrayonSDK } from 'sdk/main';
import { KrayonAPIClient } from 'sdk/api-client';

export class KrayonWalletGroupSDK {
  readonly organizationId?: string;
  readonly apiClient: KrayonAPIClient;

  constructor({ organizationId, apiClient }: { organizationId?: string; apiClient: KrayonSDK['apiClient'] }) {
    // when we remove /organizations/orgid/ we can remove this dep
    this.organizationId = organizationId;
    this.apiClient = apiClient;
  }

  createWalletGroup(walletGroupName: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post<WalletGroup>(
      `/wallet-groups`,
      { name: walletGroupName },
      {
        signal: abortSignal,
      }
    );
  }

  updateWalletGroup(
    walletGroupId: string,
    walletGroupDataToUpdate: Partial<WalletGroup>,
    extraParams?: KrayonAPICommonOptions
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.patch<WalletGroup>(`/wallet-groups/${walletGroupId}`, walletGroupDataToUpdate, {
      signal: abortSignal,
    });
  }

  listWalletGroups(filterObj?: WalletGroupFilter, extraParams?: KrayonAPICommonOptions) {
    // when we remove /organizations/orgid/ from routes we can remove all deps on organizationId
    if (!this.organizationId) {
      throw new Error('Organization ID is required to get wallets');
    }

    const { abortSignal } = extraParams || {};
    return this.apiClient.get(`/organizations/${this.organizationId}/wallet-groups`, {
      params: filterObj,
      signal: abortSignal,
    });
  }

  deleteWalletGroup(walletGroupId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.delete(`/wallet-groups/${walletGroupId}`, {
      signal: abortSignal,
    });
  }

  listWalletsInWalletGroup(
    walletGroupId: string,
    filterObj?: WalletInWalletGroupFilter,
    extraParams?: KrayonAPICommonOptions
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get(`/wallet-groups/${walletGroupId}/wallets`, {
      params: filterObj,
      signal: abortSignal,
    });
  }
}
