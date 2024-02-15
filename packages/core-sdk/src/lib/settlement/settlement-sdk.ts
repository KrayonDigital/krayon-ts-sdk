import {
  KrayonAPIClient,
  KrayonAPICommonOptions,
  KrayonSDK,
} from '@krayon-digital/core-sdk';
import {
  MerchantSettlementsResponse,
  Settlement,
  SettlementsFilter,
} from '../types/settelments';

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

  getSettlements(
    params?: SettlementsFilter,
    extraParams?: KrayonAPICommonOptions,
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<MerchantSettlementsResponse>(`/settlements`, {
      params,
      signal: abortSignal,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  }

  downloadSettlements(params?: any, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<string>(`/settlements/download-csv`, {
      params,
      signal: abortSignal,
    });
  }
}
