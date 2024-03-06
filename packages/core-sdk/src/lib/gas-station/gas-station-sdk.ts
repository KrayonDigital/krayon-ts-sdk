import { AddGasStationPayload, GasStationDto } from '../types/gas-station';
import { KrayonAPICommonOptions } from '../types/common';
import { KrayonAPIClient } from '../api-client';

export class KrayonGasStationSDK {
  readonly apiClient: KrayonAPIClient;

  constructor({ apiClient }: { apiClient: KrayonAPIClient }) {
    this.apiClient = apiClient;
  }

  createGasStation(data: AddGasStationPayload, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post<GasStationDto>(`/gas-stations`, data, {
      signal: abortSignal,
    });
  }

  getGasStation(gasStationId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<GasStationDto>(`/gas-stations/${gasStationId}`, {
      signal: abortSignal,
    });
  }

  getGasStationAssets(walletId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<GasStationDto>(
      `/gas-stations/${walletId}/assets`,
      {
        signal: abortSignal,
      }
    );
  }

  updateGasStation(
    data: AddGasStationPayload,
    extraParams?: KrayonAPICommonOptions
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.patch<GasStationDto>(
      `/gas-stations/${data.id}`,
      data,
      {
        signal: abortSignal,
      },
    );
  }

  syncGasStation(
    id: string,
    extraParams?: KrayonAPICommonOptions,
  ): Promise<void> {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post(
      `/gas-stations/${id}/sync`,
      {},
      {
        signal: abortSignal,
      },
    );
  }
}
