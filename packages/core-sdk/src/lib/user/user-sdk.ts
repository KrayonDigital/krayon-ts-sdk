import { DataWrap, KrayonAPICommonOptions } from '../types/common';
import { ApiTokenResponseDto } from '../types/api-token';
import { Pageable } from '../types/pagination';
import { AssignWalletsResponse, CreateUser, User } from '../types/user';
import { UserSpendingLimit } from '../types/spending-limit';
import { Wallet } from '../types/wallet';
import { KrayonSDK } from '../main';
import { KrayonAPIClient } from '../api-client';

export class KrayonUserSDK {
  readonly apiClient: KrayonAPIClient;

  constructor({ apiClient }: { apiClient: KrayonSDK['apiClient'] }) {
    this.apiClient = apiClient;
  }

  addUser(user: CreateUser, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post<DataWrap<User>>(`/users`, user, {
      signal: abortSignal,
    });
  }

  getUser(userId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<DataWrap<User>>(`/users/${userId}`, {
      signal: abortSignal,
    });
  }

  deleteUser(userId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.delete<DataWrap<User>>(`/users/${userId}`, {
      signal: abortSignal,
    });
  }

  updateUser(user: Partial<User>, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.patch<DataWrap<User>>(`/users/${user.id}`, user, {
      signal: abortSignal,
    });
  }

  listUserApiTokens(userId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<ApiTokenResponseDto>(`/users/${userId}/tokens`, {
      signal: abortSignal,
    });
  }

  deleteUserSpendingLimits(
    limit: Partial<UserSpendingLimit>,
    userId: string,
    extraParams?: KrayonAPICommonOptions
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post<UserSpendingLimit>(
      `/users/${userId}/spending-limits`,
      {
        spending_limits: [
          Object.assign(limit, { allowance: null, address: undefined }),
        ],
      },
      { signal: abortSignal }
    );
  }

  addUserSpendingLimits(
    data: { spending_limits: Partial<UserSpendingLimit>[] },
    userId: string,
    extraParams?: KrayonAPICommonOptions
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post<UserSpendingLimit>(
      `/users/${userId}/spending-limits`,
      data,
      { signal: abortSignal }
    );
  }

  listUserSpendingLimits(userId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<Pageable<UserSpendingLimit>>(
      `/users/${userId}/spending-limits`,
      { signal: abortSignal }
    );
  }

  listUserWallets(userId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<Pageable<Wallet>>(`/users/${userId}/wallets`, {
      signal: abortSignal,
    });
  }

  assignUserToWallets(
    wallets: string[],
    userId: string,
    extraParams?: KrayonAPICommonOptions
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post<DataWrap<AssignWalletsResponse[]>>(
      `/users/${userId}/assign-wallets`,
      { wallets },
      { signal: abortSignal }
    );
  }

  unassignUserFromWallets(
    wallets: string[],
    userId: string,
    extraParams?: KrayonAPICommonOptions
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post<DataWrap<AssignWalletsResponse[]>>(
      `/users/${userId}/unassign-wallets`,
      { wallets },
      { signal: abortSignal }
    );
  }

  getUserEmailVerification(
    userId: string,
    extraParams?: KrayonAPICommonOptions
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<DataWrap<{ email_verified: boolean }>>(
      `/users/${userId}/is-email-verified`,
      {
        signal: abortSignal,
      }
    );
  }

  listUserElections(userId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get(`/users/${userId}/elections`, {
      signal: abortSignal,
    });
  }

  linkUserIdentities(userId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post<DataWrap<any[]>>(
      `/users/${userId}/link-user-identities`,
      {},
      { signal: abortSignal }
    );
  }

  getUserIdentities(userId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<{ user_id: string; provider: string }[]>(
      `/users/${userId}/list-user-identities`,
      {
        signal: abortSignal,
      }
    );
  }

  getUseIntercomId(userId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get(`/users/${userId}/intercom-id`, {
      signal: abortSignal,
    });
  }
}
