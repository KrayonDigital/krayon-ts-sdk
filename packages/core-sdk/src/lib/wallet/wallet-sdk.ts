import {
  AssignUserToWalletResponse,
  SubAccountWallet,
  Wallet,
  WalletDerivedBlanceResponse,
  WalletNftCollectionAssetFilter,
  WalletsResponse,
} from '../types/wallet';
import { AssetResponse } from '../types/asset';
import { UserResponse } from '../types/user';
import { UpdateWallet } from '../types/wallet';
import { NftResponse, NftCollectionResponse } from '../types/nft';
import { DataWrap, KrayonAPICommonOptions } from '../types/common';
import {
  WalletFilter,
  WalletAssetFilter,
  WalletNftCollectionFilter,
  WalletUserFilter,
} from '../types/wallet';
import { KrayonSDK } from '../main';
import { KrayonAPIClient } from '../api-client';
import { SettlementSweepReport } from '../types/settelments';

export class KrayonWalletSDK {
  readonly apiClient: KrayonAPIClient;
  readonly organizationId?: string;

  constructor({
    apiClient,
    organizationId,
  }: {
    organizationId?: string;
    apiClient: KrayonSDK['apiClient'];
  }) {
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
      },
    );
  }

  getParentWallets(
    parentId: string,
    blockchain = 'all',
    extraParams?: KrayonAPICommonOptions,
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<WalletsResponse>(`/wallets/${parentId}`, {
      params: { blockchain },
      signal: abortSignal,
    });
  }

  getWalletDerivedBalance(
    id: string,
    symbol: string,
    extraParams?: KrayonAPICommonOptions,
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<WalletDerivedBlanceResponse>(
      `/wallets/${id}/derived-wallets-balance`,
      {
        params: { symbol },
        signal: abortSignal,
      },
    );
  }

  getWallet(
    walletId: string,
    params?: any,
    extraParams?: KrayonAPICommonOptions,
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<DataWrap<Wallet>>(`/wallets/${walletId}`, {
      params: params || {},
      signal: abortSignal,
    });
  }

  getWalletElections(walletId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<DataWrap<Wallet>>(
      `/wallets/${walletId}/elections`,
      {
        signal: abortSignal,
      },
    );
  }

  assignUserToWallet(
    walletId: string,
    userId: string,
    extraParams?: KrayonAPICommonOptions,
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post<AssignUserToWalletResponse>(
      `/wallets/${walletId}/assign-user`,
      {
        user_id: userId,
      },
    );
  }

  unassignUserFromWallet(
    walletId: string,
    userId: string,
    extraParams?: KrayonAPICommonOptions,
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post<AssignUserToWalletResponse>(
      `/wallets/${walletId}/unassign-user`,
      {
        user_id: userId,
      },
      {
        signal: abortSignal,
      },
    );
  }

  listWalletUsers(
    walletId: string,
    userFilter?: WalletUserFilter,
    extraParams?: KrayonAPICommonOptions,
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<UserResponse>(`/wallets/${walletId}/users`, {
      params: userFilter,
      signal: abortSignal,
    });
  }

  listWalletAssets(
    walletId: string,
    params?: WalletAssetFilter,
    extraParams?: KrayonAPICommonOptions,
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<AssetResponse>(`/wallets/${walletId}/assets`, {
      params,
      signal: abortSignal,
    });
  }

  addAssetToken(
    walletId: string,
    blockchain: string,
    symbol: string,
    extraParams?: KrayonAPICommonOptions,
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post<AssetResponse>(
      `/wallets/${walletId}/add-assets`,
      { blockchain, symbol },
      {
        signal: abortSignal,
      },
    );
  }

  createWallet(
    walletInfo:
      | {
          name: string;
          blockchain: string;
          group: string | null;
          image: string;
          parent?: string;
        }
      | SubAccountWallet,
    extraParams?: KrayonAPICommonOptions,
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post<Wallet>('/wallets', walletInfo, {
      signal: abortSignal,
    });
  }

  updateWallet(
    walletId: string,
    walletData: Wallet,
    extraParams?: KrayonAPICommonOptions,
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.put<Wallet>(`/wallets/${walletId}`, walletData, {
      signal: abortSignal,
    });
  }

  partialUpdateWallet(
    walletId: string,
    walletUpdateParams: UpdateWallet,
    extraParams?: KrayonAPICommonOptions,
  ) {
    const { abortSignal } = extraParams || {};
    // For now, just use group and name for compatibility
    // However, the types seem to to support some other fields
    const { group, name } = walletUpdateParams;
    return this.apiClient.patch(
      `/wallets/${walletId}`,
      { group, name },
      { signal: abortSignal },
    );
  }

  updateWalletGasStationStatus(
    walletId: string,
    gas_station_status: number,
    extraParams?: KrayonAPICommonOptions,
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.patch(
      `/wallets/${walletId}`,
      { gas_station_status },
      { signal: abortSignal },
    );
  }

  updateWalletQuorum(
    walletId: string,
    num_quorum: number,
    extraParams?: KrayonAPICommonOptions,
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post(
      `/wallets/${walletId}/set-quorum`,
      { num_quorum },
      { signal: abortSignal },
    );
  }

  requestWalletAccess(
    walletId: string,
    userId: string,
    extraParams?: KrayonAPICommonOptions,
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post(
      `/wallets/${walletId}/request-wallet-access`,
      { id: userId },
      { signal: abortSignal },
    );
  }

  syncWallet(
    walletId: string,
    extraParams?: KrayonAPICommonOptions,
  ): Promise<void> {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post(
      `/wallets/${walletId}/sync`,
      {},
      { signal: abortSignal },
    );
  }

  listWalletNftCollections(
    nftFilter?: WalletNftCollectionFilter,
    extraParams?: KrayonAPICommonOptions,
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<NftResponse | undefined>('/nft-collections', {
      params: nftFilter,
      signal: abortSignal,
    });
  }

  listNftCollectionAssets(
    collectionId: string,
    filterObj?: WalletNftCollectionAssetFilter,
    extraParams?: KrayonAPICommonOptions,
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<NftCollectionResponse | undefined>(
      `/nft-collections/${collectionId}/assets`,
      {
        params: filterObj,
        signal: abortSignal,
      },
    );
  }

  getNftAsset(assetId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get(`/non-fungible-assets/${assetId}`, {
      signal: abortSignal,
    });
  }

  sweepStop(walletId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post(`/wallets/${walletId}/sweep/stop`, null, {
      signal: abortSignal,
    });
  }

  sweepReport(walletId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<DataWrap<SettlementSweepReport>>(
      `/wallets/${walletId}/sweep/report`,
      {
        signal: abortSignal,
      },
    );
  }
}
