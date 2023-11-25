import {
  KrayonAPIClient,
  KrayonAPICommonOptions,
  KrayonSDK,
} from '@krayon-digital/core-sdk';
import { Settlement } from '../types/settelments';

export class KrayonSettlementSDK {
  readonly apiClient: KrayonAPIClient;

  constructor({ apiClient }: { apiClient: KrayonSDK['apiClient'] }) {
    this.apiClient = apiClient;
  }

  requestSettlement(data: Settlement, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post<Settlement>(`/settlements`, data, {
      signal: abortSignal,
    });
  }
}
