import { Provider, TransactionRequest } from '@ethersproject/abstract-provider';
import { defineReadOnly } from '@ethersproject/properties';
import { KrayonRemoteWallet, KrayonRemoteWalletInitParams } from '..//wallet/KrayonRemoteWallet';
import { SignClientTypes } from '@walletconnect/types';
// import { EIP155_SIGNING_METHODS } from '@/data/EIP155Data';
// import { getSignParamsMessage, getSignTypedDataParamsData } from '@/utils/HelperUtil';

import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer';
import { getSdkError } from '@walletconnect/utils';
import { EIP155_SIGNING_METHODS } from '../data/EIP155Data';
import { getSignParamsMessage, getSignTypedDataParamsData } from '../util/helpers';
import { ApproveRequestResult, WalletInfo } from '../types/walletconnect';
import { getChainId } from '../util/chain-utils';
import { KrayonWalletConnectSDK } from '../walletconnect-sdk';
import { IJsonRpcRequest } from '@walletconnect/legacy-types';
import { ChainType } from '../data/ChainType';
import { WalletConnectModalType } from '../util/client';

export class EIP155RemoteWalet extends KrayonRemoteWallet {
  readonly walletInfo: WalletInfo;
  readonly walletId: string;
  readonly address: string;
  readonly chainId: number;

  krayonWalletConnectSdk: KrayonWalletConnectSDK;

  constructor(walletInfo: WalletInfo, params: KrayonRemoteWalletInitParams) {
    super();
    const { krayonWalletConnectSdk, provider } = params ?? {};
    this.walletInfo = walletInfo;

    this.walletId = walletInfo.id;
    this.address = walletInfo.address;
    this.chainId = getChainId(walletInfo.blockchain);

    this.krayonWalletConnectSdk = krayonWalletConnectSdk;

    if (provider && !Provider.isProvider(provider)) {
      // logger.throwArgumentError("invalid provider", "provider", provider);
    }
    defineReadOnly(this, 'provider', provider! || null);
  }

  getChainType(): ChainType {
    return 'eip155';
  }

  override async getChainId(): Promise<number> {
    return this.chainId;
  }

  static init(walletInfo: WalletInfo, params: KrayonRemoteWalletInitParams) {
    return new EIP155RemoteWalet(walletInfo, params);
  }

  hasMPA(operationType: WalletConnectModalType): boolean {
    const mpaByNotOnlyOwner = (this.walletInfo?.num_quorum ?? 1) > 1;
    const mpaByMethod = [WalletConnectModalType.SignTransaction].includes(operationType);
    return mpaByNotOnlyOwner || mpaByMethod;
  }
  // getMnemonic() {
  //     throw "Not implemented"
  // }

  async getAddress() {
    return this.address;
  }

  async signMessage(message: string) {
    const walletId = this.walletId;
    const response = await this.krayonWalletConnectSdk.signMessage({
      walletId,
      method: 'personal_sign',
      message,
    });
    if (response.status === 'PROCESSED') {
      const { signature } = response.result;
      return signature;
    } else {
      throw new Error('Node result received, but election still in progress. Need to wait.');
    }
  }

  async _signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    message: Record<string, any>
  ): Promise<string> {
    const walletId = this.walletId;

    // https://github.com/ethers-io/ethers.js/issues/687#issuecomment-714069471
    delete types['EIP712Domain'];

    const response = await this.krayonWalletConnectSdk.signTypedData({
      walletId,
      method: 'eth_signTypedData',
      message: {
        domain,
        types,
        message,
      },
    });
    if (response.status === 'PROCESSED') {
      const { signature } = response.result;
      return signature;
    } else {
      // The expectation of this function is that we return as soon as we get the first API response
      // If we have an election, we can't do that so this function errors out
      // Use Wallet Connect functionality for election watching
      throw new Error('Node result received, but election still in progress. Need to wait.');
    }
  }

  async signTransaction(transaction: TransactionRequest) {
    const walletId = this.walletId;

    const response = await this.krayonWalletConnectSdk.signTransaction({
      walletId,
      method: 'eth_signTransaction',
      message: transaction,
    });

    if (response.status === 'PROCESSED') {
      const { signature } = response.result;
      return signature;
    } else {
      throw new Error('Node result received, but election still in progress. Need to wait.');
    }
  }

  connect(provider: Provider) {
    return new EIP155RemoteWalet(this.walletInfo, { provider, krayonWalletConnectSdk: this.krayonWalletConnectSdk });
  }

  /**
   * This is the core of the EIP155 Wallet connect flow.
   *
   * We need to do a switch on the request.method, and based on that, we need to appropriately parse it
   * and then, we need to call the appropriate KrayonWalletConnectSDK method.
   *
   * @param requestEvent: SignClientTypes.EventArguments['session_request']
   * @returns Promise<ApproveRequestResult>
   */
  async startApproveRequest(requestEvent: Pick<SignClientTypes.EventArguments['session_request'], 'id' | 'params'>): Promise<ApproveRequestResult> {
    const { params, id: wcRequestId } = requestEvent;
    const { chainId, request } = params;
    // Note: we don't actually consider chainId here, since our walletId is already scoped to a chainId
    // TODO: However, we might need/want to check whether the chosen wallet is on the correct chain

    const walletId = this.walletId;

    switch (request.method) {
      case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
      case EIP155_SIGNING_METHODS.ETH_SIGN:
        // TS Note: we have to use braces here since each of the result vars is of different type (based on the method)
        // so we need to block scope each, and call wrapPotentialElection within each block as opposed to just one call
        // at the end of the switch
        {
          // need to use blocks because we use local vars
          const message = getSignParamsMessage(request.params);
          const result = await this.krayonWalletConnectSdk.signMessage({
            walletId,
            // this is ok because of the case block
            method: request.method,
            message,
          });
          return this.krayonWalletConnectSdk.wrapPotentialElection(wcRequestId, result);
        }
        break;

      case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
      case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
      case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
        {
          const { domain, types, message } = getSignTypedDataParamsData(request.params);
          // Note: for signTypedData, our message actually consists of three internal keys: domain, types, and message
          // one of which is again the message
          const result = await this.krayonWalletConnectSdk.signTypedData({
            walletId,
            method: 'eth_signTypedData',
            message: { domain, types, message },
          });
          return this.krayonWalletConnectSdk.wrapPotentialElection(wcRequestId, result);
        }
        break;

      case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
        {
          // Note: This send transaction means we rely on wallet service to do the actual broadcast of the signed tX.
          // This means we send it the request to send, and when it's ready (approved via MPA), wallet
          // service will broadcast the TX.
          // Alternative implementation would send the eth_signTransaction, and then broadcast it ourselves via
          // our provider - something like the following:
          //     const provider = new providers.JsonRpcProvider(EIP155_CHAINS[chainId as TEIP155Chain].rpc)
          //     const connectedWallet = wallet.connect(provider)
          //     const { hash } = await connectedWallet.sendTransaction(signedTx)
          // This doesn't make a lot of sense in our use case, especially given that we don't necessarily
          // have the signed transaction if we call eth_signTransaction (we might only have the election)
          // So we just do the base case - invoke eth_sendTransaction in which wallet service will do the broadcast

          const txToSign = request.params[0];
          const result = await this.krayonWalletConnectSdk.sendTransaction({
            walletId,
            method: 'eth_sendTransaction',
            message: txToSign,
          });
          return this.krayonWalletConnectSdk.wrapPotentialElection(wcRequestId, result);
        }
        break;

      case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
        {
          const txToSign = request.params[0];
          const result = await this.krayonWalletConnectSdk.signTransaction({
            walletId,
            method: 'eth_signTransaction',
            message: txToSign,
          });
          return this.krayonWalletConnectSdk.wrapPotentialElection(wcRequestId, result);
        }
        break;

      default:
        throw new Error(getSdkError('INVALID_METHOD').message);
        break;
    }
  }

  /**
   * Core function for the legacy (v1) flow - just standardizes the data from the v1 method.
   *
   * @param request: IJsonRpcRequest
   * @returns Promise<ApproveRequestResult>
   */
  async legacyStartApproveRequest(request: IJsonRpcRequest) {
    const { id, method, params } = request;

    const requestEvent = {
          id,
          topic: '',
          params: {
              request: { method, params },
              chainId: (await this.getChainId()).toString(),
          }
    }
    return this.startApproveRequest(requestEvent);
  }
}
