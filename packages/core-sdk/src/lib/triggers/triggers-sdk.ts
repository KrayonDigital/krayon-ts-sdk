import { KrayonAPIClient } from '../api-client';
import { KrayonSDK } from '../main';
import { KrayonAPICommonOptions, PaginationRequest } from '../types/common';
import { Pageable } from '../types/pagination';
import { Transfer } from '../types/transfer';

export type TriggerFilter = PaginationRequest & {
  status?: string;
};

export type TransferTagsFilter = PaginationRequest;

export class KrayonTriggersSDK {
  readonly apiClient: KrayonAPIClient;

  constructor({ apiClient }: { apiClient: KrayonSDK['apiClient'] }) {
    this.apiClient = apiClient;
  }

  getTriggers(params?: TriggerFilter, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<Pageable<Transfer>>(`/triggers`, {
      params,
      signal: abortSignal,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  }

  createTrigger(data: any, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post(`/triggers`, data, {
      signal: abortSignal,
    });
  }
}
