import {
  DataWrap,
  KrayonAPICommonOptions,
  PaginationRequest,
} from '../types/common';
import { Pageable } from '../types/pagination';
import { Tag } from '../types/tag';
import {
  Transaction,
  TransferDetail,
  Transfer,
  CreateTransaction,
  WithdrawalTransaction,
  DepositTransaction,
} from '../types/transfer';
import { KrayonSDK } from '../main';
import { KrayonAPIClient } from '../api-client';

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
    return this.apiClient.get<DataWrap<TransferStatusResponse>>(
      `/transfers/${transferId}/status`,
      {
        signal: abortSignal,
      }
    );
  }

  listTransfers(params?: TransferFilter, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<Pageable<Transfer>>(`/transfers`, {
      params,
      signal: abortSignal,
    });
  }

  listTransferTags(
    transferId: string,
    params?: TransferTagsFilter,
    extraParams?: KrayonAPICommonOptions
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<DataWrap<Tag>>(`/transfers/${transferId}/tags`, {
      params,
      signal: abortSignal,
    });
  }

  createTransfer(
    transferData: CreateTransaction,
    extraParams?: KrayonAPICommonOptions
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post<TransferDetail>(`/transfers`, transferData, {
      signal: abortSignal,
    });
  }

  getTransfer(transferId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<DataWrap<Transfer>>(`/transfers/${transferId}`, {
      signal: abortSignal,
    });
  }

  createTransferWithdrawal(
    transferData: WithdrawalTransaction,
    extraParams?: KrayonAPICommonOptions
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post<TransferDetail>(
      `/transfers/withdrawal`,
      transferData,
      {
        signal: abortSignal,
      }
    );
  }

  createTransferDeposit(
    transferData: DepositTransaction,
    extraParams?: KrayonAPICommonOptions
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post<TransferDetail>(
      `/transfers/deposit`,
      transferData,
      {
        signal: abortSignal,
      }
    );
  }

  updateTransfer(
    transferId: string,
    transferDataToUpdate: UpdateTransferDto,
    extraParams?: KrayonAPICommonOptions
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.patch<DataWrap<Transfer>>(
      `/transfers/${transferId}`,
      transferDataToUpdate,
      {
        signal: abortSignal,
      }
    );
  }
}
