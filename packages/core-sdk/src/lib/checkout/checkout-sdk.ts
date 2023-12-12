import { KrayonAPIClient } from '../api-client';
import { KrayonSDK } from '../main';
import { KrayonAPICommonOptions } from '../types';
import { CheckoutResponse } from '../types/checkout';

export class KrayonCheckoutSDK {
  readonly apiClient: KrayonAPIClient;

  constructor({ apiClient }: { apiClient: KrayonSDK['apiClient'] }) {
    this.apiClient = apiClient;
  }

  getCheckout(id: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<CheckoutResponse>(`/checkouts/${id}`, {
      signal: abortSignal,
    });
  }
}
