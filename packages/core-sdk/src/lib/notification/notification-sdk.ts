import { KrayonAPIClient } from '../api-client';
import { KrayonSDK } from '../main';
import {
  KrayonAPICommonOptions,
  MerchantNotificationResponse,
  NotificationsFilter,
} from '../types';

export class KrayonNotificationSDK {
  readonly apiClient: KrayonAPIClient;

  constructor({ apiClient }: { apiClient: KrayonSDK['apiClient'] }) {
    this.apiClient = apiClient;
  }

  getNotifications(
    params?: NotificationsFilter,
    extraParams?: KrayonAPICommonOptions,
  ) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<MerchantNotificationResponse>(`/notifications`, {
      params,
      signal: abortSignal,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  }
}
