import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
  PropsWithChildren,
} from 'react';
import SignClient from '@walletconnect/sign-client';
import { useKrayon, useKrayonSDKStatus } from '../../use-sdk-hooks';
import { EIP155RemoteWalet, KrayonWalletConnectSDK, SessionRequestHandlerParam, assignSignClientModalEvents } from '@krayon-digital/walletconnect-sdk';
import { CoreTypes, EngineTypes, PairingTypes, SignClientTypes } from '@walletconnect/types';
import { Wallet } from '@krayon-digital/core-sdk';

type WalletConnectContextType = {
  sdk: KrayonWalletConnectSDK | null, // this is essentially WalletConnect SDK, lacking a better name
  signClient: SignClient | null;
  proposal: SignClientTypes.EventArguments['session_proposal'] | null;
  sessionRequest: SessionRequestHandlerParam | null;
  pairings: PairingTypes.Struct[];
  pair: (params: EngineTypes.PairParams) => Promise<PairingTypes.Struct | undefined>;
  unpair: (pairingParams: PairingTypes.Struct) => Promise<void>;
  finishSessionRequest: () => void;
  finishProposal: () => void;
  refreshPairings: () => void;
  getRemoteWallet: (walletInfo: Wallet) => EIP155RemoteWalet;
}

export const WalletConnectContext = createContext<WalletConnectContextType>({signClient: null} as WalletConnectContextType);


// Props here are all the event handlers
export type WalletConnectContextProviderProps = PropsWithChildren<Partial<Parameters<typeof assignSignClientModalEvents>[1]>> & {
  wcInitializationParams: CoreTypes.Options
};

export function WalletConnectContextProvider(props: WalletConnectContextProviderProps) {
  const { children, onSessionProposal, onSessionRequest, wcInitializationParams } = props;
  const [ client, setClient ] = useState<SignClient | null>(null);
  const krayonSdkStatus = useKrayonSDKStatus();
  const Krayon = useKrayon();
  const [ proposalQueue, setProposalQueue ] = useState<SignClientTypes.EventArguments['session_proposal'][]>([]);
  const [ sessionRequestQueue, setSessionRequestQueue ] = useState<SessionRequestHandlerParam[]>([]);

  const [ pairings, setPairings ] = useState<PairingTypes.Struct[]>(client?.pairing?.values ?? []);
  const [ walletConnectSdk, setWalletConnectSdk] = useState<KrayonWalletConnectSDK | null>(null);

  const refreshPairings = useCallback(() => {
    if(!client) {
      console.warn("Cannot refresh pairings without client");
      return;
    }
    setPairings(client.pairing.values);
  }, [client]);

  const pair = useCallback(async (params: EngineTypes.PairParams) => {
    if(!client) {
      console.warn("Cannot pair without client");
      return;
    }
    const pairResult = await client.pair(params);
    // TODO: note - peer metadata not available at this point in pairResult
    console.log("Paired", pairResult);
    refreshPairings();
    return pairResult;
  }, [client, refreshPairings]);

  const unpair = useCallback(async (pairingParams: PairingTypes.Struct) => {
    if(!client) {
      console.warn("Cannot unpair without client");
      return;
    }
    // direct disconnect always seems to fail even though pairing is present
    // TODO: fix this - when unpairing without disconnect we're not notifying the client
    try {

      await client?.disconnect({
          topic: pairingParams.topic,
          reason: {
              code: 0,
              message: "User disconnected"
          }
      });
      console.log("Unpaired", pairingParams);
      refreshPairings();
    }
    catch (e) {
      console.warn("Pairing not able to disconnect on", pairingParams.topic, 'error:', e)
    }
    // try {
    //   await client?.core.pairing.disconnect({topic: pairingParams.topic})
    // }
    // catch (e) {
    //   console.warn("Error while disconnecting pairing", e)
    // }



  }, [client, refreshPairings]);

  // This allows the client to "consume" the request and mark it as consumed
  const finishSessionRequest = useCallback(() => {
    setSessionRequestQueue((prev) => prev.length ? prev.slice(1) : []);
  }, [setSessionRequestQueue]);

  const finishProposal = useCallback(() => {
    setProposalQueue((prev) => prev.length ? prev.slice(1) : []);
  }, [setProposalQueue]);

  useEffect(() => {
    if (krayonSdkStatus === 'ready' && wcInitializationParams?.projectId) {
      setWalletConnectSdk(new KrayonWalletConnectSDK({apiClient: Krayon.getApiClient(), electionSdk: Krayon.election}))
      SignClient.init(wcInitializationParams).then((signClient) => {
        setClient(signClient);
        assignSignClientModalEvents(signClient, {
           onSessionProposal: (proposal) => {
            setProposalQueue([...proposalQueue, proposal]);
            onSessionProposal?.(proposal)
           },
           onSessionRequest: (params) => {
            setSessionRequestQueue([...sessionRequestQueue, params]);
            onSessionRequest?.(params)
           },
        });
        setPairings(signClient.pairing.values)
      }).catch((e: any) => {
        console.warn('Error while initializing auth client.', e);
        setClient(null);
      });
    }
  }, [krayonSdkStatus, wcInitializationParams]);

  const ctxVal = {
    sdk: walletConnectSdk,
    signClient: client,
    proposal: proposalQueue?.[0] ?? null,
    sessionRequest: sessionRequestQueue?.[0] ?? null,
    pairings,
    pair,
    unpair,
    refreshPairings,
    finishProposal,
    finishSessionRequest,
    getRemoteWallet: (walletInfo: Wallet) => {
      if(!walletConnectSdk) {
        throw new Error("WalletConnect SDK not initialized");
      }
      // TODO: add wallet instance selection for non-eip155 chains
      // TODO: consider caching
      return new EIP155RemoteWalet(walletInfo, { krayonWalletConnectSdk: walletConnectSdk })
    },
  }

  return (
    <WalletConnectContext.Provider value={ctxVal}>
      {children}
    </WalletConnectContext.Provider>
  );
}
