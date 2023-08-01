import React, { useContext } from 'react';
import { OngoingRequestQueueContext } from './OngoingRequestQueueProvider';
import { WalletConnectContext } from './WalletConnectContextProvider';
import { AvailableWalletsContext } from './AvailableWalletsProvider';

export const useWalletConnect = () => {
  const walletConnectContext = useContext(WalletConnectContext);
  // const legacyWalletConnectContext = useContext(LegacyWalletConnectContext);
  // const electionQueueContext = useContext(ElectionQueueContext);
  return {
    ...walletConnectContext,
    isReady: walletConnectContext?.signClient !== null,
  }
};

export const useWalletConnectOngoingRequests = () => {
  const electionQueueContext = useContext(OngoingRequestQueueContext);
  if (!electionQueueContext) {
    throw new Error('electionQueueContext has to be used within <WalletConnectContext.Provider>');
  }
  return electionQueueContext;
}


export const useWalletConnectAvailableWallets = () => {
  const availableWalletsContext = useContext(AvailableWalletsContext);
  if (!availableWalletsContext) {
    throw new Error('availableWalletsContext has to be used within <WalletConnectContext.Provider>');
  }
  return availableWalletsContext;
}
