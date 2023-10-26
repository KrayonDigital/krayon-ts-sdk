import { AxiosError } from 'axios';
import { Election, ElectionErrorResponse, ElectionResult } from '../types/election';
import { DataWrap, KrayonAPICommonOptions } from '../types/common';
import { ElectionFilter, ElectionDetail, ElectionDecision, ElectionVote } from '../types/election';
import { Pageable } from '../types/pagination';
import { KrayonSDK } from '../main';
import { KrayonAPIClient } from '../api-client';

export class KrayonElectionSDK {
  readonly apiClient: KrayonAPIClient;

  constructor({ apiClient }: { apiClient: KrayonSDK['apiClient'] }) {
    this.apiClient = apiClient;
  }

  listElections(params: ElectionFilter, options?: KrayonAPICommonOptions) {
    const { abortSignal: signal } = options || {};
    return this.apiClient.get<Pageable<Election>>(`/elections`, { params, signal });
  }

  getElection(id: string, options?: KrayonAPICommonOptions) {
    const { abortSignal: signal } = options || {};
    const config = { signal };
    return this.apiClient.get<ElectionDetail>(`/elections/${id}`, config);
  }

  cancelElection(id: string) {
    return this.apiClient.delete<ElectionVote>(`/elections/${id}/vote`);
  }

  voteElection(id: string, vote: ElectionDecision, options?: KrayonAPICommonOptions) {
    const { abortSignal: signal } = options || {};
    const payload = { vote };
    const config = { signal };
    // No data wrap here - should this be changed on the API?
    return this.apiClient.post<ElectionVote>(`/elections/${id}/vote`, payload, config);
  }

  getElectionResult(id: string, options?: KrayonAPICommonOptions) {
    const { abortSignal: signal } = options || {};
    const config = { signal };
    return this.apiClient.get<DataWrap<ElectionResult>>(`/elections/${id}/result`, config);
  }

  pollElectionResult(electionId: string, timeoutMs = 120000) {
    const pollInterval = 5 * 1000;
    let totalMSElapsed = 0;
    return new Promise<DataWrap<ElectionResult>>((resolve, reject) => {
      const intervalId = setInterval(async () => {
        totalMSElapsed += pollInterval;
        try {
          const electionResult = (await this.getElectionResult(electionId)).data;
          if (totalMSElapsed > timeoutMs || electionResult) {
            clearInterval(intervalId);
            if (!electionResult) {
              reject({ electionId, reason: 'timeout' });
            }
          }
          if (electionResult) {
            resolve(electionResult);
          }
        } catch (e) {
          try {
            const axError = e as AxiosError<ElectionErrorResponse>;
            const errDetails = axError.response?.data?.error?.details ?? { message: '', extra: {} };

            // quick hack to parse the response, and if it isn't pending, just reject it
            const {
              message: errorMessage = '',
              extra: { decision: electionDecision = null, closed_at = null },
            } = errDetails;
            console.log('Poll returned.', errorMessage);
            if (electionDecision !== ElectionDecision.PENDING) {
              clearInterval(intervalId);
              reject({ electionId, reason: electionDecision, closed_at });
            }
          } catch (e2) {
            console.log(
              'Poll returned, not understanding repsonse due to ',
              e2,
              'Rejecting. Response: ',
              (e as AxiosError)?.response?.data
            );
            reject({ electionId, reason: ElectionDecision.REJECTED });
          }
        }
      }, pollInterval);
    });
  }
}
