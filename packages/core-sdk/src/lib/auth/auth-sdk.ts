import { User } from '../types/user';
import { DataWrap, KrayonAPICommonOptions } from '../types/common';
import { KrayonSDK } from '../main';
import { KrayonAPIClient } from '../api-client';

export class KrayonAuthSDK {
  readonly apiClient: KrayonAPIClient;

  constructor({ apiClient }: { apiClient: KrayonSDK['apiClient'] }) {
    this.apiClient = apiClient;
    console.log('AVIAD ITS ALIVE!!!!');
    
  }

  createApiToken(options?: KrayonAPICommonOptions) {
    const { abortSignal } = options || {};
    const config = { signal: abortSignal };
    return this.apiClient.get<{ access: string }>('/token/obtain', config);
  }

  revokeApiToken(token: string, options?: KrayonAPICommonOptions) {
    const { abortSignal } = options || {};
    const config = { signal: abortSignal };
    return this.apiClient.post('/token/revoke', { access: token }, config);
  }

  login(options?: KrayonAPICommonOptions) {
    const { abortSignal } = options || {};
    const config = { signal: abortSignal };

    return this.apiClient.get<DataWrap<User>>(`/login`, config);
  }
}
