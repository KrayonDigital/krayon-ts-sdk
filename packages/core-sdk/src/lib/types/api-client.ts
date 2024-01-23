import { AxiosRequestConfig } from 'axios';

// Define configuration type for KrayonAPIClient
export type KrayonAPIClientConfig = AxiosRequestConfig & {
  appId?: string;
  frontendVariant?: 'mobile' | 'web',
  maxRequests?: number;
  perMilliseconds?: number;
  // Define endpoint-specific throttling settings. Note, the initial config should omit the currentRequests and requestQueue fields
  endpointThrottling?: {
    [endpoint: string]: ThrottlingConfig;
  };

  token?: string;
  rawUserInfoHeader?: string;
};

export type ThrottlingConfig = {
  maxRequests: number;
  perMilliseconds: number;
};
