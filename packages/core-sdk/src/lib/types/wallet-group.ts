import { PaginationRequest } from './common';
import { Pageable } from './pagination';

export interface WalletGroup {
  id: string;
  name: string;
  order: number;
  organization: string;
}

export type WalletGroupsResponse = Pageable<WalletGroup>;

// At the moment, these don't support any additional filtering
// But if we do add them, we can simply extend the type - example below
export type WalletGroupFilter = PaginationRequest; // & { userId: string, amount: number, ... }
export type WalletInWalletGroupFilter = PaginationRequest;
