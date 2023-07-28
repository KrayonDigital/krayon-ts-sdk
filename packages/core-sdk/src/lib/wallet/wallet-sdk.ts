import { Wallet, WalletNftCollectionAssetFilter, WalletsResponse } from '../types/wallet';
import { AssetResponse } from '../types/asset';
import { UserResponse } from '../types/user';
import { UpdateWallet } from '../types/wallet';
import { NftResponse, NftCollectionResponse } from '../types/nft';
import { KrayonAPICommonOptions } from '../types/common';
import { WalletFilter, WalletAssetFilter, WalletNftCollectionFilter, WalletUserFilter } from '../types/wallet';
import { KrayonSDK } from '../main';
import { KrayonAPIClient } from '../api-client';

export class KrayonWalletSDK {
  readonly apiClient: KrayonAPIClient;
  readonly organizationId?: string;

  constructor({ apiClient, organizationId }: { organizationId?: string; apiClient: KrayonSDK['apiClient'] }) {
    this.apiClient = apiClient;
    // when we remove /organizations/orgid/ we can remove this dep
    this.organizationId = organizationId;
  }

  listWallets(params?: WalletFilter, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};

    // when we remove /organizations/orgid/ from routes we can remove all deps on organizationId
    if (!this.organizationId && !params?.organization) {
      throw new Error('Organization ID is required to get wallets');
    }

    return this.apiClient.get<WalletsResponse>(
      `/organizations/${this.organizationId ?? params?.organization}/wallets`,
      {
        params,
        signal: abortSignal,
      }
    );
  }

  getWallet(walletId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<{ data: Wallet }>(`/wallets/${walletId}`, {
      signal: abortSignal,
    });
  }

  getWalletElections(walletId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<{ data: Wallet }>(`/wallets/${walletId}/elections`, {
      signal: abortSignal,
    });
  }

  assignUserToWallet(walletId: string, userId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post<UserResponse>(`/wallets/${walletId}/assign-user`, {
      user_id: userId,
    });
  }

  unassignUserFromWallet(walletId: string, userId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post<UserResponse>(
      `/wallets/${walletId}/unassign-user`,
      {
        user_id: userId,
      },
      {
        signal: abortSignal,
      }
    );
  }

  listWalletUsers(walletId: string, userFilter?: WalletUserFilter, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<UserResponse>(`/wallets/${walletId}/users`, { 
      params: userFilter,
      signal: abortSignal 
    });
  }

  listWalletAssets(walletId: string, assetFilter?: WalletAssetFilter, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<AssetResponse>(
      `/wallets/${walletId}/assets`,{ 
        params: assetFilter, 
        signal: abortSignal 
      }
    );
  }

  createWallet(
    walletInfo: { name: string; blockchain: string; group: string | null; image: string },
    extraParams?: KrayonAPICommonOptions
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post<Wallet>('/wallets', walletInfo, { signal: abortSignal });
  }

  updateWallet(walletId: string, walletData: Wallet, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.put<Wallet>(`/wallets/${walletId}`, walletData, { signal: abortSignal });
  }

  partialUpdateWallet(walletId: string, walletUpdateParams: UpdateWallet, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    // For now, just use group and name for compatibility
    // However, the types seem to to support some other fields
    const { group, name } = walletUpdateParams;
    return this.apiClient.patch(`/wallets/${walletId}`, { group, name }, { signal: abortSignal });
  }

  updateWalletQuorum(walletId: string, num_quorum: number, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post(`/wallets/${walletId}/set-quorum`, { num_quorum }, { signal: abortSignal });
  }

  requestWalletAccess(walletId: string, userId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post(`/wallets/${walletId}/request-wallet-access`, { id: userId }, { signal: abortSignal });
  }

  syncWallet(walletId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get(`/wallets/${walletId}/sync`, { signal: abortSignal });
  }

  listWalletNftCollections(nftFilter?: WalletNftCollectionFilter, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<NftResponse | undefined>('/nft-collections', { 
      params: nftFilter, 
      signal: abortSignal,
    });
  }

  listNftCollectionAssets(collectionId: string, filterObj?: WalletNftCollectionAssetFilter, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<NftCollectionResponse | undefined>(`/nft-collections/${collectionId}/assets`, { 
      params: filterObj,
      signal: abortSignal,
    });
  }

  getNftAsset(assetId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get(`/non-fungible-assets/${assetId}`, { signal: abortSignal });
  }
}
