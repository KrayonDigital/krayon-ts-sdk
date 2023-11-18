import { KrayonAPIClient } from '../api-client';
import { KrayonSDK } from '../main';
import { KrayonAPICommonOptions, MerchantNotificationResponse } from '../types';

export class KrayonNotificationSDK {
  readonly apiClient: KrayonAPIClient;

  constructor({ apiClient }: { apiClient: KrayonSDK['apiClient'] }) {
    this.apiClient = apiClient;
  }

  getNotifications(extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<MerchantNotificationResponse>(`/notifications`, {
      signal: abortSignal,
    });
  }
}
