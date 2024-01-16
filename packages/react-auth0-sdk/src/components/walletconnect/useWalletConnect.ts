import { useContext } from 'react';
import { WalletConnectContext } from './WalletConnectContextProvider';

export const useWalletConnect = () => {
  const walletConnectContext = useContext(WalletConnectContext);
  // const legacyWalletConnectContext = useContext(LegacyWalletConnectContext);
  // const electionQueueContext = useContext(ElectionQueueContext);
  return {
    ...walletConnectContext,
    isReady: walletConnectContext?.signClient !== null,
  }
};
