import { WhitelistContract } from '../types/whitelist';
import {
  WhiteListContractQuery,
  WhiteListContractQueryUpdate,
} from '../types/whitelist';
import { KrayonSDK } from '../main';
import { KrayonAPIClient } from '../api-client';
import { Pageable } from '@krayon-digital/core-sdk';

export class KrayonWhitelistnSDK {
  readonly apiClient: KrayonAPIClient;

  constructor({ apiClient }: { apiClient: KrayonSDK['apiClient'] }) {
    this.apiClient = apiClient;
  }

  queryWhitelists(search: string) {
    return this.apiClient.get<Pageable<WhitelistContract>>(
      `/whitelists?search=${search}`
    );
  }

  listWhitelists(id: string) {
    return this.apiClient.get(`/whitelists/${id}`);
  }

  createWhitelist(data: WhiteListContractQuery) {
    return this.apiClient.post<{ data: { whitelists: WhitelistContract[] } }>(
      `/whitelists`,
      {
        whitelists: [data],
      }
    );
  }

  updateWhitelist(id: string, data: WhiteListContractQueryUpdate) {
    return this.apiClient.patch(`/whitelists/${id}`, { data });
  }

  deleteWhitelist(id: string) {
    return this.apiClient.delete(`/whitelists/${id}`);
  }
}
