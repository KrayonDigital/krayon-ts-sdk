import { Coin } from './util';
import { Election } from './election';
import { PaginationRequest } from './common';

export enum TransactionStatus {
  FAILURE = 'TRANSACTION_FAILURE',
  SUCCESS = 'TRANSACTION_SUCCESS',
  PENDING = 'TRANSACTION_PENDING',
  AWAITING_MPA = 'AWAITING_MPA',
  MPA_REJECTED = 'MPA_REJECTED',
  MPA_EXPIRED = 'MPA_EXPIRED',
  MPA_APPROVED = 'MPA_APPROVED',
  UNDEFINED = 'UNDEFINED',
}

export const StatusName = new Map();
StatusName.set(TransactionStatus.FAILURE, 'Failure');
StatusName.set(TransactionStatus.SUCCESS, 'Success');
StatusName.set(TransactionStatus.PENDING, 'Pending');
StatusName.set(TransactionStatus.AWAITING_MPA, 'Awaiting MPA');
StatusName.set(TransactionStatus.MPA_REJECTED, 'Rejected');
StatusName.set(TransactionStatus.MPA_EXPIRED, 'Expired');
StatusName.set(TransactionStatus.MPA_APPROVED, 'Approved');
StatusName.set(TransactionStatus.UNDEFINED, 'Undefined');

export enum Direction {
  In = 'IN',
  Out = 'OUT',
  Undefined = 'UNDEFINED',
}

export interface Transaction {
  id: string;
  nonce: number;
  gas_price: number;
  gas_limit: number;
  gas_used: number;
  native_price: string;
  transaction_fee: number;
  transaction_fee_usd: string;
  from_address: string;
  to_address: string;
  hash: string;
  value: number;
  type: number;
  chain_id: number;
  status: string;
  block: number;
  block_time_stamp: string;
}

export interface WithdrawalTransaction {
  amount: string;
  wallet: string | undefined;
  symbol: string;
  currency: string;
  note?: string;
  tags?: string[];
  transaction_fee?: string;
  transaction_fee_usd?: string;
}

export interface CreateTransaction {
  from_address: string | undefined;
  to_address: string;
  amount: string;
  wallet: string | undefined;
  native_price?: number;
  transaction_fee?: string;
  transaction_fee_usd?: string;
}

interface TransferBase {
  id: string;
  from_address: string;
  to_address: string;
  direction: Direction;
  status: TransactionStatus;
  amount: string;
  wallet: string;
  symbol: Coin;
  note: string;
  tags: string[];
}

export interface Transfer extends TransferBase {
  blockchain: string;
  chain_id: number;
  amount_wei: number;
  native_price: string;
  token_price: string;
  transaction: string;
  transaction_fee: number;
  transaction_fee_usd: number;
  block_time_stamp: string;
  decimals: number;
  name: string;
  logo_uri: string;
  hash: string;
}

export interface TransferDetail extends TransferBase {
  transaction: Transaction | null;
  election?: Election | null;
  initiator: string;
}

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
  blockchain?: string;
};
export type TransferTagsFilter = PaginationRequest;
