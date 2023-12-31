import { KrayonAPICommonOptions, PaginationRequest } from '../types/common';
import { CreateNftTransaction } from '../types/nft';
import { Pageable } from '../types/pagination';
import { Tag } from '../types/tag';
import { TransferDetail, Transfer, UpdateNftTransferDto, TransferFilter, TransferTagsFilter } from '../types/transfer';
import { KrayonSDK } from '../main';
import { KrayonAPIClient } from '../api-client';


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
