import { ReactElement, useState, createContext, useRef, PropsWithChildren } from 'react';
import { SignClientTypes } from '@walletconnect/types';
import { JsonRpcError, JsonRpcResult, formatJsonRpcError, formatJsonRpcResult } from '@walletconnect/jsonrpc-utils';
import { Election, ElectionDecision, ElectionResult } from '@krayon-digital/core-sdk';
import { ApproveRequestResult } from '@krayon-digital/walletconnect-sdk';
import { useWalletConnect } from './useWalletConnect';

type ApprovedRequestResult = {
  walletConnectRequestId: SignClientTypes.EventArguments['session_request']['id'];
  election: Election | null;
  isRejected: boolean;
  isResolved: true;
  result: any;
};

type EnqueueResultParams = {
  startResult: ApproveRequestResult;
  onAccept?: (jsonRpcResult: JsonRpcResult<ApprovedRequestResult['result']>) => void;
  onReject?: (jsonRpcError: JsonRpcError, originalParams?: ApproveRequestResult) => void;
};

export interface ElectionQueueInterface {
  activeElections: Election[];
  pastElections: Election[];
  enqueueStartApprovalResult: (params: EnqueueResultParams) => void;
}

export const OngoingRequestQueueContext = createContext<ElectionQueueInterface>({
  activeElections: [],
  pastElections: [],
  enqueueStartApprovalResult: (params) => {return},
}); // appease TS

/**
 * Functional component that provides an Election Queue Context to its children
 * This context provides state and actions for handling and storing election results
 */
export const OngoingRequestQueueProvider = ({ children }: PropsWithChildren): ReactElement => {
  // We store the active and past elections in state
  const [activeElections, setActiveElections] = useState<Election[]>([]);
  const [pastElections, setPastElections] = useState<Election[]>([]);

  // Use a ref to maintain a mutable variable holding the current elections
  const elections = useRef<Election[]>([]);

  const { sdk: walletConnectSdk } = useWalletConnect();

  // update the current elections, split them into active and past elections based on their decision status
  const updateElectionStates = (electionFromResult: Election) => {
    if (!electionFromResult) {
      return;
    }
    // update the current elections - replace existing if any, or add to the end if not
    let electionIndex = elections.current.findIndex((e) => e.id === electionFromResult.id);
    if (electionIndex !== -1) {
      elections.current[electionIndex] = electionFromResult;
    } else {
      electionIndex = elections.current.length;
      elections.current.push(electionFromResult);
    }

    // setActiveElections on a subset of elections.current where election status is active
    // setPastElections on a subset of elections.current where election status is not active
    setActiveElections(elections.current.filter((e) => e.decision === ElectionDecision.PENDING));
    setPastElections(elections.current.filter((e) => e.decision !== ElectionDecision.PENDING));
  };

  // handle the start of an election approval process and manage its result
  const enqueueStartApprovalResult = (params: EnqueueResultParams) => {
    // Type guard, this shouldn't happen in normal circumstances since we
    // only call this once this condition is met
    if(!walletConnectSdk) {
      return;
    }

    const { startResult, onAccept, onReject } = params;

    // As soon as we enqueue, we also add it to our record if it has an election
    startResult.election && updateElectionStates(startResult.election);

    // Asynchronously poll the start result. This could even return immediately,
    // but we don't mind and process it async (walletConnectPollElectionResult handles that).

    // We have the initial result that was obtained from the API
    // This might already be the final result, or we might need subsequent polling to get the final result
    // This function will do the polling (if necessary) and return the final result
    // Its main use is to return the JSON-RPC response that should be sent back via WalletConnect
    // However, this component doesn't send it directly, it just calls onAccept/onReject event which
    // should send the data back via WalletConnect
    walletConnectSdk
      .waitWalletConnectElectionResult(startResult)
      .then((finalElectionResult: ElectionResult) => {
        const { result, decision } = finalElectionResult;

        // If the election was closed, we need to update the closed_at time
        // But allow it to be overriden with the finalElectionResult in case of error
        let closed_at = finalElectionResult.closed_at ?? null;

        // finalResult will contain what startResult.result didn't initially have
        console.log(
          'Operation confirmed ' + (finalElectionResult.id ? 'with' : 'without') + ` MPA. Request id: ${startResult.walletConnectRequestId}. Received election result.`,
          finalElectionResult
        );

        // It's a success, so we need to send the result through WalletConnect channel
        // We'll also trigger
        if (decision === ElectionDecision.APPROVED) {
          const jsonRpcResp = formatJsonRpcResult(startResult.walletConnectRequestId, result);
          onAccept && onAccept(jsonRpcResp);
        }
        // Note - we have two error conditions. This one is when an election is sucessfully completed
        // But was rejected/abstained - we need to fail as usual
        // The catch case is when the API couldn't give us a proper response - we also need to reject
        else {
          const errorMessage = finalElectionResult.decision
            ? `Election was ${finalElectionResult.decision}.`
            : 'Unknown error.';
          const jsonRpcError = formatJsonRpcError(startResult.walletConnectRequestId, errorMessage);
          onReject && onReject(jsonRpcError, startResult);

          // If the election was closed, we need to update the closed_at time
          if (finalElectionResult.extra?.closed_at) {
            closed_at = finalElectionResult.extra?.closed_at;
          }

          if (finalElectionResult.decision === ElectionDecision.PENDING) {
            console.warn('Invalid condition - a pending election should not be resolved.');
          }
        }

        // Make sure the election status is up to date after we received the result
        // Note - we use the election data from the starting object, and just update the decision
        startResult.election && updateElectionStates({ ...startResult.election, decision, closed_at });
      })
      .catch((error: any) => {
        console.error('There was an error polling the election result:', error);
      });
  };

  // The value to be passed to the provider and subsequently available to its consumer components
  const ctxValue: ElectionQueueInterface = {
    activeElections,
    pastElections,
    enqueueStartApprovalResult,
  };

  return <OngoingRequestQueueContext.Provider value={ctxValue}>{children}</OngoingRequestQueueContext.Provider>;
};
