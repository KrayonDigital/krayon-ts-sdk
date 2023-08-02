import { DataWrap, Wallet } from '@krayon-digital/core-sdk';
import { Election } from '@krayon-digital/core-sdk';
import { Transaction } from '@krayon-digital/core-sdk';
import { TransactionRequest } from '@ethersproject/abstract-provider';
import {
  TypedDataDomain,
  TypedDataField,
} from '@ethersproject/abstract-signer';
import { SignClientTypes } from '@walletconnect/types';

export const VALID_ETH_RPC_METHODS = [
  'eth_sign',
  'personal_sign',
  'eth_signTypedData',
  'eth_signTransaction',
  'eth_sendTransaction',
] as const;

export type ETH_RPC_METHOD = (typeof VALID_ETH_RPC_METHODS)[number];

export type SignMessageProps = {
  walletId: string;
  method: 'eth_sign' | 'personal_sign';
  message: string;
};

export type SignTypedDataProps = {
  walletId: string;
  method: 'eth_signTypedData';
  message: {
    domain: TypedDataDomain;
    types: Record<string, TypedDataField[]>;
    message: Record<string, any>;
  }; // _signTypedData data
};

export type SignTransactionProps = {
  walletId: string;
  method: 'eth_signTransaction';
  message: Partial<TransactionRequest>;
};

export type SendTransactionProps = Omit<SignTransactionProps, 'method'> & {
  method: 'eth_sendTransaction';
};

export type SignResult = {
  signature: string;
};

export type SendTransactionResult = {
  tx: Transaction;
};

export type WalletConnectCallResult<ResultType> =
  | {
      status: 'STARTED' | 'AWAITING_MPA';
      election: Election;
    }
  | {
      status: 'PROCESSED';
      result: ResultType;
    };

// We require id, address and blockchain, but we don't require the rest of the fields
export type WalletInfo = Partial<Wallet> &
  Pick<Wallet, 'id' | 'address' | 'blockchain'>;

export type ApproveRequestResult = {
  walletConnectRequestId: SignClientTypes.EventArguments['session_request']['id'];
  election: Election | null;
  isRejected: boolean;
} & (
  | {
      isResolved: true;
      result: any; // the result of an operation
    }
  | {
      isResolved: false;
    }
);

export enum WalletConnectOperation {
  SessionProposal = 'SessionProposal',
  SignMessage = 'SignMessage',
  SignTypedData = 'SignTypedData',
  SendTransaction = 'SendTransaction',
}
