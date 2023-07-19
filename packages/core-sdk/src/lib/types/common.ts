export type KrayonAPICommonOptions = {
  abortSignal?: AbortSignal; // to be used with AbortController, if required
};

export type PaginationRequest = {
  page?: number;
};

export type RetryRateLimitConfig = {
  retries?: number;
  delay?: number;
  timeout?: number;
} & ({ backOff?: 'linear' } | { backOff?: 'exponential'; backOffFactor?: number } | { backOff?: 'header' }); // as given by the server

export type DataWrap<T> = { data: T };
