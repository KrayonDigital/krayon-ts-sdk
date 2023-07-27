import { KrayonAPIClient } from '@krayon-digital/core-sdk';
import {
  SignMessageProps,
  SignTypedDataProps,
  SignTransactionProps,
  SendTransactionProps,
  SignResult,
  SendTransactionResult,
  WalletConnectCallResult,
  ApproveRequestResult,
} from './types/walletconnect';
import { ElectionDecision, ElectionResult, ElectionResultPollRejection } from '@krayon-digital/core-sdk';
import { DataWrap } from '@krayon-digital/core-sdk';
import { KrayonElectionSDK } from '@krayon-digital/core-sdk';

export class KrayonWalletConnectSDK {
  protected readonly apiClient: KrayonAPIClient;
  protected readonly electionSdk: KrayonElectionSDK;

  constructor({ apiClient, electionSdk }: { apiClient: KrayonAPIClient; electionSdk: KrayonElectionSDK }) {
    this.apiClient = apiClient;
    this.electionSdk = electionSdk;
  }

  protected walletConnectCall = async <ResultType = SignResult>(
    props: SignMessageProps | SignTypedDataProps | SignTransactionProps | SendTransactionProps
  ) => {
    const { walletId, method, message } = props;

    const payload = {
      message,
      method,
    };
    const response = await this.apiClient.post<DataWrap<WalletConnectCallResult<ResultType>>>(
      `/wallets/${walletId}/wallet-connect`,
      payload
    );
    return response.data.data;
  };

  wrapPotentialElection = <ResultType = SignResult>(
    wcRequestId: number,
    response: WalletConnectCallResult<ResultType>
  ): ApproveRequestResult => {
    if (response.status === 'PROCESSED') {
      return {
        walletConnectRequestId: wcRequestId,
        election: null,
        isResolved: true,
        result: response.result, // the result of an operation
        isRejected: false, // If rejected, it'll be handled through exception
      };
    } else if (response.status === 'AWAITING_MPA') {
      return {
        walletConnectRequestId: wcRequestId,
        election: response.election,
        isResolved: false,
        isRejected: false,
      };
    } else {
      throw new Error(`Unsupported response status: ${response.status}`);
    }
  };

  signMessage = (props: SignMessageProps) => this.walletConnectCall(props);
  signTypedData = (props: SignTypedDataProps) => this.walletConnectCall(props);
  signTransaction = (props: SignTransactionProps) => this.walletConnectCall(props);
  sendTransaction = (props: SendTransactionProps) => this.walletConnectCall<SendTransactionResult>(props);

  // Poll the election request based on the ApproveRequestResult
  async waitWalletConnectElectionResult(startResult: ApproveRequestResult): Promise<ElectionResult> {
    const { isResolved, election, isRejected } = startResult;
    if (isResolved) {
      // Result only available on resolved elections
      const result = startResult.result;

      // If we don't have an election, this means we were directly able to execute
      // Our election result will not include election ID
      if (!election) {
        const decision = isRejected ? ElectionDecision.REJECTED : ElectionDecision.APPROVED;
        return { id: '', result, decision };
      }

      // If we don't have the result need to make sure this is known
      if (!result) {
        console.log('Invalid response structure on PROCESSED status', startResult);
      }

      return {
        id: election.id,
        result,
        decision: isRejected ? ElectionDecision.REJECTED : election.decision,
        created_at: election.created_at,
        closed_at: election.closed_at,
      };
    } else {
      if (!election) {
        // Note: this shouldn't happen since all non-resolved results should have an election
        // but if it does, we should reject the election. We also appease TS with this check
        console.log(
          "Invalid election even though election isn't resolved so there should be an election.",
          startResult
        );
        return { id: '', result: null, decision: ElectionDecision.REJECTED };
      }
      // console.log("Waiting for election", election);
      try {
        const polledResult = await this.electionSdk.pollElectionResult(election.id);
        return polledResult.data;
      } catch (e) {
        const { reason = null, closed_at = null } = e as ElectionResultPollRejection;
        console.log('Polling election failed. Rejecting.', e);
        return {
          id: election.id,
          result: null,
          decision: ElectionDecision.REJECTED,
          extra: {
            rejectReason: reason,
            closed_at,
          },
        };
      }
    }
  }
}
