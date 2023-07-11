import axios, { Axios, AxiosDefaults, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { KrayonAPIClientConfig, ThrottlingConfig } from 'sdk/types/api-client';

// Internal type, used to store both throttiling params and keep track of state
type ThrottlingInfo = ThrottlingConfig & {
  currentRequests: number;
  requestQueue: (() => void)[];
};

export class KrayonAPIClient {
  readonly appId?: string;
  // Store default throttling settings
  private defaultThrottling: ThrottlingInfo;
  // Store endpoint-specific throttling settings and state
  private endpointThrottling = new Map<string, ThrottlingInfo>();

  private authErrorCounter: number = 0;

  private axiosInstance: AxiosInstance;

  constructor(config: KrayonAPIClientConfig) {
    const {
      appId,
      maxRequests = 5,
      perMilliseconds = 1000,
      endpointThrottling: requestedEndpointThrottling = {},
      token = null,
      rawUserInfoHeader,
      ...axiosConfig
    } = config;
    this.axiosInstance = axios.create(axiosConfig);

    this.setInterceptor();

    // There might be a case where we don't have the token yet
    // This is potentially if we use the SDK itself to get the token
    // So we need to set the headers after the fact
    if (token) {
      this.setAuthorizationHeaders(token, rawUserInfoHeader);
    }

    this.appId = appId;
    this.defaultThrottling = {
      maxRequests,
      perMilliseconds,
      currentRequests: 0,
      requestQueue: [],
    };
    // Initialize endpoint-specific throttling state
    for (const endpoint in requestedEndpointThrottling) {
      this.endpointThrottling.set(endpoint, {
        ...requestedEndpointThrottling[endpoint],
        currentRequests: 0,
        requestQueue: [],
      });
    }
  }

  setAuthorizationHeaders(token: string, rawUserInfoHeader?: string) {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    if (rawUserInfoHeader) {
      this.axiosInstance.defaults.headers.common['UserInfo'] = rawUserInfoHeader;
    }
  }

  setInterceptor() {
    const context = this;
    this.axiosInstance?.interceptors?.response?.use(
      function (response) {
        context.authErrorCounter = 0;
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        // NOTE: Uncomment to collect real data
        // axios.post('http://localhost:3001/collect', { url: response.config.url, payload: response.data });
        return response;
      },
      async function (error) {
        const originalRequest = error.config;

        if (error.response?.status === 401) {
          if (context.authErrorCounter < 2) {
            context.authErrorCounter += 1;
          } else {
            context.authErrorCounter = 0;
            window.location.href = '/login';
          }
        }
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
      }
    );
  }

  // Perform a request, using endpoint-specific or default throttling settings
  async request<T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R> {
    const endpointConfig = this.endpointThrottling.get(config.url ?? '');
    return this.requestWithThrottling(config, endpointConfig ?? this.defaultThrottling);
  }

  // Perform a request with throttling
  private async requestWithThrottling<T = any, R = AxiosResponse<T>, D = any>(
    config: AxiosRequestConfig,
    throttlingInfo: ThrottlingInfo
  ): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      // Function to execute the request
      const executeRequest = async () => {
        throttlingInfo.currentRequests++;
        try {
          const response = await this.axiosInstance.request<T, R, D>(config);
          resolve(response);
        } catch (error) {
          reject(error);
        } finally {
          throttlingInfo.currentRequests--;
          this.processQueue(throttlingInfo);
        }
      };

      // Check if the request can be executed immediately or if it should be queued
      if (throttlingInfo.currentRequests < throttlingInfo.maxRequests) {
        executeRequest();
      } else {
        throttlingInfo.requestQueue.push(executeRequest);
      }
    });
  }

  // Process the request queue for an endpoint or the default throttling settings
  private processQueue(throttlingInfo: ThrottlingInfo) {
    // Return early if there are no requests in the queue or the maximum number of requests is reached
    if (throttlingInfo.requestQueue.length === 0 || throttlingInfo.currentRequests >= throttlingInfo.maxRequests) {
      return;
    }

    // Execute the next request in the queue after waiting for the specified delay
    const nextRequest = throttlingInfo.requestQueue.shift();
    if (nextRequest) {
      setTimeout(nextRequest, throttlingInfo.perMilliseconds);
    }
  }

  // HTTP methods
  get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
    const combinedConfig: AxiosRequestConfig = { ...config, url, method: 'GET' };
    return this.request<T, R, D>(combinedConfig);
  }

  post<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: any, config?: AxiosRequestConfig<D>): Promise<R> {
    const combinedConfig: AxiosRequestConfig = { ...config, url, data, method: 'POST' };
    return this.request<T, R, D>(combinedConfig);
  }

  delete<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
    const combinedConfig: AxiosRequestConfig = { ...config, url, method: 'DELETE' };
    return this.request<T, R, D>(combinedConfig);
  }

  put<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: any, config?: AxiosRequestConfig<D>): Promise<R> {
    const combinedConfig: AxiosRequestConfig = { ...config, url, data, method: 'PUT' };
    return this.request<T, R, D>(combinedConfig);
  }

  patch<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: any, config?: AxiosRequestConfig<D>): Promise<R> {
    const combinedConfig: AxiosRequestConfig = { ...config, url, data, method: 'PATCH' };
    return this.request<T, R, D>(combinedConfig);
  }

  head<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
    const combinedConfig: AxiosRequestConfig = { ...config, url, method: 'HEAD' };
    return this.request<T, R, D>(combinedConfig);
  }

  options<T = any, R = AxiosResponse<T>, D = any>(url: string, config: AxiosRequestConfig<D>): Promise<R> {
    const combinedConfig: AxiosRequestConfig = { ...config, url, method: 'OPTIONS' };
    return this.request<T, R, D>(combinedConfig);
  }
}
