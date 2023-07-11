import { DataWrap, KrayonAPICommonOptions, PaginationRequest } from 'sdk/types/common';
import { Pageable } from 'sdk/types/pagination';
import { Tag } from 'sdk/types/tag';
import { Transaction, TransferDetail, Transfer, CreateTransaction } from 'sdk/types/transfer';
import { KrayonSDK } from 'sdk/main';
import { KrayonAPIClient } from 'sdk/api-client';

export type UpdateTransferDto = Partial<Pick<Transfer, 'note' | 'tags'>>;
export type TransferStatusResponse = DataWrap<
  Pick<Transaction, 'hash' | 'status' | 'gas_used'> & { total_cost: string }
>;

export type TransferFilter = PaginationRequest & {
  from_address?: string;
  from_address_con?: string;
  from_address_nexact?: string;
  to_address?: string;
  to_address_con?: string;
  to_address_nexact?: string;
  date_from?: string;
  date_to?: string;
  tags?: string;
  wallet_id?: string;
  status?: string;
  direction?: string;
};

export type TransferTagsFilter = PaginationRequest;

export class KrayonTransferSDK {
  readonly apiClient: KrayonAPIClient;

  constructor({ apiClient }: { apiClient: KrayonSDK['apiClient'] }) {
    this.apiClient = apiClient;
  }

  getTransferStatus(transferId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<DataWrap<TransferStatusResponse>>(`/transfers/${transferId}/status`, {
      signal: abortSignal,
    });
  }

  listTransfers(params?: TransferFilter, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<Pageable<Transfer>>(`/transfers`, {
      params,
      signal: abortSignal,
    });
  }

  listTransferTags(transferId: string, params?: TransferTagsFilter, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<DataWrap<Tag>>(`/transfers/${transferId}/tags`, {
      params,
      signal: abortSignal,
    });
  }

  createTransfer(transferData: CreateTransaction, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post<DataWrap<TransferDetail>>(`/transfers`, transferData, {
      signal: abortSignal,
    });
  }

  getTransfer(transferId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<DataWrap<Transfer>>(`/transfers/${transferId}`, {
      signal: abortSignal,
    });
  }

  updateTransfer(transferId: string, transferDataToUpdate: UpdateTransferDto, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.patch<DataWrap<Transfer>>(`/transfers/${transferId}`, transferDataToUpdate, {
      signal: abortSignal,
    });
  }
}
