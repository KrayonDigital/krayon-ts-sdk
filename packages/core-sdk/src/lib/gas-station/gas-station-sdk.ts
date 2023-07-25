import { GasStationDto } from '../types/gas-station';
import { KrayonAPICommonOptions } from '../types/common';
import { KrayonAPIClient } from '../api-client';

export class KrayonGasStationSDK {
  readonly apiClient: KrayonAPIClient;

  constructor({ apiClient }: { apiClient: KrayonAPIClient }) {
    this.apiClient = apiClient;
  }

  createGasStation(data: GasStationDto, extraParams?: KrayonAPICommonOptions) {
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
    return this.apiClient.get<GasStationDto>(`/gas-stations/${walletId}/assets`, {
      signal: abortSignal,
    });
  }

  updateGasStation(gasStationId: string, data: GasStationDto, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.patch<GasStationDto>(`/gas-stations/${gasStationId}`, data, {
      signal: abortSignal,
    });
  }
}
