import { PropsWithChildren, createContext, useCallback, useEffect, useState } from 'react';
import { IJsonRpcRequest, IWalletConnectSession } from '@walletconnect/legacy-types';

// Hack -- import the types from this one, but use the UMD version for the code
// otherwise it doesn't work
import LegacyWalletConnect from '@walletconnect/client';
// @ts-ignore
import LegacySignClient from '@walletconnect/client/dist/umd/index.min.js';

import { parseUri } from '@walletconnect/utils';
import { LegacySessionRequestParam, LegacyWalletConnectEvent, LegacyWalletConnectMessage } from '@krayon-digital/walletconnect-sdk';

const unassignLegacyClientEvents = (client: LegacyWalletConnect | null) => {
  if (!client) {
    return;
  }
  client.off(LegacyWalletConnectEvent.SessionRequest);
  client.off(LegacyWalletConnectEvent.CallRequest);
};

const legacyWalletConnectSessionKey = 'walletconnect_session';
const storeWalletConnectSession = (session: IWalletConnectSession | null | undefined) => {
  window.localStorage.setItem(legacyWalletConnectSessionKey, JSON.stringify(session ?? null));
};
const loadWalletConnectSession = (): IWalletConnectSession | null => {
  const sessionStr = window.localStorage.getItem(legacyWalletConnectSessionKey);
  if (!sessionStr) {
    return null;
  }
  return JSON.parse(sessionStr) as IWalletConnectSession;
};

export const LegacyWalletConnectContext = createContext<{
  legacySignClient: LegacyWalletConnect | null;
  legacyProposal?: LegacySessionRequestParam | null;
  legacyCallRequest?: IJsonRpcRequest | null;
  legacySession: IWalletConnectSession | null;
  legacyConnect: (uri: string) => void;
  legacyDisconnect: () => void;
  legacyFinishSessionProposal: () => void;
  legacyFinishCallRequest: (params: { isApproved: boolean }) => void;
}>({
  legacySignClient: null,
  legacyProposal: null,
  legacyCallRequest: null,
  legacySession: null,
  legacyConnect: () => {},
  legacyDisconnect: () => {},
  legacyFinishSessionProposal: () => {},
  legacyFinishCallRequest: () => {},
});

// This essentially acts as v1 context, or in other words, v1 client initializer
// The reason it needs to be a frontend component in v1 is the URI - it needs to be
// something user can enter,s o this component provides a field for this
export const LegacyWalletConnectContextProvider = (props: PropsWithChildren) => {
  const { children } = props;

  const [legacySignClient, setLegacySignClient] = useState<LegacyWalletConnect | null>(null);
  const [legacyProposalQueue, setLegacyProposalQueue] = useState<LegacySessionRequestParam[]>([]); // Proposals should be limited to one, but keep it like this for now
  const [legacyCallRequestQueue, setLegacyCallRequestQueue] = useState<IJsonRpcRequest[]>([]);
  const [legacySession, setLegacySession] = useState<IWalletConnectSession | null>(loadWalletConnectSession());

  const legacyConnect = useCallback(
    async (uri: string) => {
      if (!uri) {
        return;
      }
      const { version } = parseUri(uri);
      if (version !== 1) {
        return;
      }
      if (legacySignClient) {
        // TODO: do we need to disconnect?
        unassignLegacyClientEvents(legacySignClient);
      }
      // TODO: here we can get the version

      const newLegacySignClient = new (LegacySignClient as typeof LegacyWalletConnect)({ uri });
      setLegacySignClient(newLegacySignClient);
      // TODO: unitiialize old client?
    },
    [legacySignClient]
  );

  const legacyDisconnect = useCallback(async () => {
    legacySignClient?.killSession();
    setLegacySignClient(null);
    setLegacySession(null);
    setLegacyProposalQueue([]);
    setLegacyCallRequestQueue([]);
    window.localStorage.removeItem(legacyWalletConnectSessionKey);
  }, [legacySignClient]);

  const onRetrieveSession = useCallback(() => {
    if (!legacySession) {
      return;
    }
    const legacySignClient = new (LegacySignClient as typeof LegacyWalletConnect)({ session: legacySession });

    console.log('LegacySignClient', LegacySignClient);

    setLegacySignClient(legacySignClient);
    // TODO: unitiialize old client?
  }, [legacySignClient, legacySession]);

  // Automatically retrieve the session if we have it, but we don't have the client
  // If this is not desired, offer a function to load a legacy session if !client.connected  && legacySession
  useEffect(() => {
    if (!legacySignClient && legacySession) {
      console.log('WC v1: Restoring existing session.');
      onRetrieveSession();
      return;
    }
  }, [legacySession]);

  useEffect(() => {
    if (!legacySignClient) {
      return;
    }

    const onSessionRequest = (error: any, legacyProposal: LegacyWalletConnectMessage<LegacySessionRequestParam>) => {
      if (error) {
        throw new Error(`legacySignClient > session_request failed: ${error}`);
      }
      if (!legacyProposal) {
        return;
      }
      setLegacyProposalQueue([...legacyProposalQueue, legacyProposal.params[0]]);
    };
    const onCallRequest = (error: any, payload: IJsonRpcRequest) => {
      if (error) {
        throw new Error(`legacySignClient > call_request failed: ${error}`);
      }
      console.log('Call request', payload);
      setLegacyCallRequestQueue([...legacyCallRequestQueue, payload]);
    };
    legacySignClient.on(LegacyWalletConnectEvent.SessionRequest, onSessionRequest);
    legacySignClient.on(LegacyWalletConnectEvent.CallRequest, onCallRequest);

    return () => unassignLegacyClientEvents(legacySignClient);
  }, [legacySignClient]);

  const legacyFinishSessionProposal = () => {
    const [proposal, ...remainder] = legacyProposalQueue ?? [];
    setLegacyProposalQueue(remainder);
    storeWalletConnectSession(legacySignClient?.session);
    return proposal;
  };

  const legacyFinishCallRequest = useCallback(async () => {
    // setLegacyCallRequestQueue(null);
    const [callRequest, ...remainder] = legacyCallRequestQueue ?? [];
    setLegacyCallRequestQueue(remainder);
    return callRequest;
  }, []);

  const ctxVal = {
    legacyProposal: legacyProposalQueue?.[0] ?? null,
    legacySignClient,
    legacySession,
    legacyCallRequest: legacyCallRequestQueue?.[0] ?? null,
    legacyConnect,
    legacyDisconnect,
    legacyFinishCallRequest,
    legacyFinishSessionProposal,
  };

  return <LegacyWalletConnectContext.Provider value={ctxVal}>{children}</LegacyWalletConnectContext.Provider>;
};
