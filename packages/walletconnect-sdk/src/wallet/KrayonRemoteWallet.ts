import { Provider } from '@ethersproject/abstract-provider';
import { Signer, TypedDataDomain, TypedDataField, TypedDataSigner } from '@ethersproject/abstract-signer';
import { formatJsonRpcResult } from '@walletconnect/jsonrpc-utils';
import { SignClientTypes } from '@walletconnect/types';
import { ApproveRequestResult, WalletInfo } from '../types/walletconnect';
import { KrayonWalletConnectSDK } from '../walletconnect-sdk';
import { ChainType } from '../data/ChainType';
import { WalletConnectModalType } from '../util/client';

export type KrayonRemoteWalletInitParams = { krayonWalletConnectSdk: KrayonWalletConnectSDK; provider?: Provider };

export abstract class KrayonRemoteWallet extends Signer implements TypedDataSigner {
  abstract walletInfo: WalletInfo;

  abstract _signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>
  ): Promise<string>;

  abstract startApproveRequest(
    requestEvent: SignClientTypes.EventArguments['session_request']
  ): Promise<ApproveRequestResult>;

  abstract getChainType(): ChainType;

  finishApproveRequest(requestResult: ApproveRequestResult) {
    if (requestResult.isRejected) {
      throw new Error('Request rejected');
    }
    if (!requestResult.isResolved) {
      throw new Error('Request not yet resolved');
    }
    return formatJsonRpcResult(requestResult.walletConnectRequestId, requestResult.result);
  }

  abstract hasMPA(operationType: WalletConnectModalType): boolean;
}
