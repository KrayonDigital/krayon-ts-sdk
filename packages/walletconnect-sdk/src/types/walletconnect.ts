import { DataWrap, Wallet } from '@krayon/core-sdk';
import { Election } from '@krayon/core-sdk';
import { Transaction } from '@krayon/core-sdk';
import { TransactionRequest } from '@ethersproject/abstract-provider';
import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer';
import { SignClientTypes } from '@walletconnect/types';
import { IJsonRpcRequest } from '@walletconnect/legacy-types';
import LegacySignClient from '@walletconnect/client';

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
export type WalletInfo = Partial<Wallet> & Pick<Wallet, 'id' | 'address' | 'blockchain'>;

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
  SendTransaction = 'SendTransaction'
}

// export type WalletConnectMessagePayload =
//   { method: 'eth_sign' | 'personal_sign', message: any} |
//   { method: 'eth_signTypedData', message: { domain: TypedDataDomain, types: Record<string, TypedDataField[]>, message: Record<string, any> } } |
//   { method: 'eth_signTransaction' | 'eth_sendTransaction', message: Partial<TransactionRequest> }


// Legacy Types
export interface LegacyWalletConnectMessage<T> extends IJsonRpcRequest {
  params: T[];
}

export interface LegacySessionRequestParam {
  peerId: string;
  peerMeta: LegacyPeerMeta;
  chainId: number;
}

interface LegacyPeerMeta {
  description: string;
  url: string;
  icons: string[];
  name: string;
}

export interface LegacyCallRequestParam {
  gas: string;
  value: string;
  from: string;
  to: string;
  data: string;
}

export enum LegacyWalletConnectEvent {
  SessionRequest = 'session_request',
  CallRequest = 'call_request',
}

export type LegacySignClientSession = LegacySignClient['session']
