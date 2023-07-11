import { KrayonAPICommonOptions, PaginationRequest } from 'sdk/types/common';
import { CreateNftTransaction } from 'sdk/types/nft';
import { Pageable } from 'sdk/types/pagination';
import { Tag } from 'sdk/types/tag';
import { TransferDetail, Transfer } from 'sdk/types/transfer';
import { KrayonSDK } from 'sdk/main';
import { KrayonAPIClient } from 'sdk/api-client';

export type UpdateNftTransferDto = Partial<Pick<Transfer, 'note' | 'tags'>>;
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

export class KrayonNftTransferSDK {
  readonly apiClient: KrayonAPIClient;

  constructor({ apiClient }: { apiClient: KrayonSDK['apiClient'] }) {
    this.apiClient = apiClient;
  }

  createNftTransfer(nftTransferObj: CreateNftTransaction, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post<TransferDetail>(`/nft-transfers`, nftTransferObj, {
      signal: abortSignal,
    });
  }

  updateNftTranfser(
    nftTranferId: string,
    nftTransferDataToUpdate: UpdateNftTransferDto,
    extraParams?: KrayonAPICommonOptions
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.patch<Transfer>(`/nft-tranfsers/${nftTranferId}`, nftTransferDataToUpdate, {
      signal: abortSignal,
    });
  }

  listNftTransfers(filterObj?: TransferFilter, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<Pageable<Transfer>>('/nft-transfers', {
      params: filterObj,
      signal: abortSignal,
    });
  }

  getNftTransfer(nftTranferId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get(`/nft-tranfsers/${nftTranferId}`, {
      signal: abortSignal,
    });
  }

  listTransferTags(nftTransferId: string, filterObj?: TransferTagsFilter, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<Tag>(
      `/nft-transfers/${nftTransferId}/tags`, {
        params: filterObj,
        signal: abortSignal,
    });
  }
}
