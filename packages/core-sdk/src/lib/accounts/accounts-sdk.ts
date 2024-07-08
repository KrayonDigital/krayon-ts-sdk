import { KrayonAPIClient } from '../api-client';
import { KrayonSDK } from '../main';
import { BankAccount } from '../types/account';
import { Asset } from '../types/asset';
import {
  DataWrap,
  KrayonAPICommonOptions,
  PaginationRequest,
} from '../types/common';

export type OrganizationAssetFilter = Partial<Asset> & PaginationRequest;

export class KrayonAccountsSDK {
  readonly apiClient: KrayonAPIClient;

  constructor({ apiClient }: { apiClient: KrayonSDK['apiClient'] }) {
    this.apiClient = apiClient;
  }

  externalAccountList(extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<DataWrap<BankAccount[]>>(`external-accounts`, {
      signal: abortSignal,
    });
  }

  createExternalAccount(
    bankAccount: BankAccount,
    extraParams?: KrayonAPICommonOptions,
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post(`external-accounts`, bankAccount, {
      signal: abortSignal,
    });
  }

  getExternalAccount(id: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<DataWrap<BankAccount[]>>(
      `external-accounts/${id}`,
      {
        signal: abortSignal,
      },
    );
  }

  deleteExternalAccount(id: string) {
    return this.apiClient.delete(`external-accounts/${id}`);
  }
}
