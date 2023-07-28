import { IJsonRpcRequest, IWalletConnectSession } from '@walletconnect/legacy-types';
import LegacySignClient from '@walletconnect/client';
// The above should be equivalent to the below, but the above isn't working 
// @ts-ignore
import LegacyWalletConnectUmd from '@walletconnect/client/dist/umd/index.min.js';
import { EIP155_SIGNING_METHODS } from '../data/EIP155Data';
import { WalletConnectOperation } from '../types/walletconnect';

export let legacySignClient: LegacySignClient;

export function createLegacySignClient({ uri }: { uri?: string } = {}) {
  // If URI is passed always create a new session,
  // otherwise fall back to cached session if client isn't already instantiated.
  if (uri) {
    deleteCachedLegacySession();
    // Some hacks to make sure the thing works and is properly typed
    // If we import it normally, it doesn't work
    const legacySignClient = new (LegacyWalletConnectUmd as typeof LegacySignClient)({ uri });
    return legacySignClient;
  } else if (getCachedLegacySession()) {
    const session = getCachedLegacySession();
    const legacySignClient = new (LegacyWalletConnectUmd as typeof LegacySignClient)({ session });
    return legacySignClient;
  } else {
    return;
  }
}

type SessionProposalHandlerFn = (legacyProposal: IJsonRpcRequest) => void;
type CallRequestHandlerFn = (
  modalName: WalletConnectOperation.SendTransaction | WalletConnectOperation.SignMessage | WalletConnectOperation.SignTypedData,
  modalProps: {
    legacyCallRequestEvent: IJsonRpcRequest;
    legacyRequestSession: IWalletConnectSession;
  }
) => void;

export function assignLegacySignClientModalEvents(
  legacySignClient: LegacySignClient,
  onSessionProposal: SessionProposalHandlerFn,
  onCallRequest: CallRequestHandlerFn
) {
  legacySignClient.on('session_request', (error: any, payload: IJsonRpcRequest) => {
    if (error) {
      throw new Error(`legacySignClient > session_request failed: ${error}`);
    }
    onSessionProposal(payload);
  });

  legacySignClient.on('connect', () => {
    console.log('legacySignClient > connect');
  });

  legacySignClient.on('error', (error: any) => {
    throw new Error(`legacySignClient > on error: ${error}`);
  });

  legacySignClient.on('call_request', (error: any, payload: IJsonRpcRequest) => {
    if (error) {
      throw new Error(`legacySignClient > call_request failed: ${error}`);
    }
    onCallRequestProxy(legacySignClient, payload, onCallRequest);
  });

  legacySignClient.on('disconnect', async () => {
    deleteCachedLegacySession();
  });
}

// This function will essentially do a switch on the methods, and map the equivalent ones
const onCallRequestProxy = async (
  legacySignClient: LegacySignClient,
  payload: IJsonRpcRequest,
  callRequestHandler: CallRequestHandlerFn
) => {
  switch (payload.method) {
    case EIP155_SIGNING_METHODS.ETH_SIGN:
    case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
      return callRequestHandler(WalletConnectOperation.SignMessage, {
        legacyCallRequestEvent: payload,
        legacyRequestSession: legacySignClient.session,
      });

    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
      return callRequestHandler(WalletConnectOperation.SignTypedData, {
        legacyCallRequestEvent: payload,
        legacyRequestSession: legacySignClient.session,
      });

    case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
      return callRequestHandler(WalletConnectOperation.SendTransaction, {
        legacyCallRequestEvent: payload,
        legacyRequestSession: legacySignClient.session,
      });

    default:
      alert(`${payload.method} is not supported for WalletConnect v1`);
  }
};

function getCachedLegacySession(): IWalletConnectSession | undefined {
  if (typeof window === 'undefined') return;

  const local = window.localStorage ? window.localStorage.getItem('walletconnect') : null;

  let session = null;
  if (local) {
    // eslint-disable-next-line no-useless-catch
    try {
      session = JSON.parse(local);
    } catch (error) {
      throw error;
    }
  }
  return session;
}

function deleteCachedLegacySession(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('walletconnect');
}
