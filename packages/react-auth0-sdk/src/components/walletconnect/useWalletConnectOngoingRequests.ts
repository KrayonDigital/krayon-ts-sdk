import { useContext } from 'react';
import { OngoingRequestQueueContext } from './OngoingRequestQueueProvider';

export const useWalletConnectOngoingRequests = () => {
  const electionQueueContext = useContext(OngoingRequestQueueContext);
  if (!electionQueueContext) {
    throw new Error('electionQueueContext has to be used within <WalletConnectContext.Provider>');
  }
  return electionQueueContext;
}
