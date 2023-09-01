import { Asset } from './asset';
import { User } from './user';
import { PaginationRequest } from './common';
import { Election } from './election';
import { Pageable } from './pagination';

export interface Wallet {
  id: string;
  name: string;
  organization: string;
  group: string | null;
  address: string;
  blockchain: string;
  total_usd_balance: string;
  aggregated_usd_balance: string;
  image?: string;
  description: string;
  num_quorum: number;
  num_admins?: number;
  num_approvers?: number;
  pending_usd_balance: string;
  parent: string;
  // custom fields
  is_quorum_approved?: boolean;
  is_active?: boolean;
  number_of_owners?: number;
  owners_quorum?: number;
  election?: Election;
  election_user?: string;
  gas_station_status?: number;
}

export type WalletsResponse = Pageable<Wallet>;

export enum UpdateQuorumStatus {
  AWAITING_MPA = 'AWAITING_MPA',
  PROCESSED = 'PROCESSED',
  ERROR = 'ERROR',
}

export interface UpdateQuorum {
  previous_num_quorum: number;
  num_users_on_wallet: number;
  requested_num_quorum: number;
  election: Election;
  status: UpdateQuorumStatus;
}

export interface AssignUser {
  status: UpdateQuorumStatus;
}

export interface UnAssignUser {
  status: UpdateQuorumStatus;
}

export type AssignUserToWalletResponse = AssignUser & Election;

export type UnAssignUserToWalletResponse = UnAssignUser & Election;

export interface UpdateWallet {
  name?: string;
  description?: string;
  group?: null | string;
}

export type WalletFilter = Partial<Wallet> & PaginationRequest;
// TODO: we might want to update the asset filters on the backend to be stronger
export type WalletAssetFilter = Partial<Asset> & PaginationRequest;
export type WalletUserFilter = Partial<User> & PaginationRequest;
export type WalletNftCollectionFilter = {
  wallet_id?: string;
  blockchain?: string;
} & PaginationRequest;
export type WalletNftCollectionAssetFilter = {
  wallet_id?: string;
} & PaginationRequest;

export interface SubAccountWallet {
  name: string;
  blockchain: string;
  sub_account: string;
}
