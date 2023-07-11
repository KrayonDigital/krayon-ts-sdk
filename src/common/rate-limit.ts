import { AxiosError, AxiosResponse } from 'axios';
import { RetryRateLimitConfig } from 'sdk/types/common';

export const retryRateLimit = async <T extends (...args: any[]) => Promise<R>, R extends AxiosResponse>(
  apiCallFn: T,
  apiParams?: Parameters<T>,
  config?: RetryRateLimitConfig
): Promise<R> => {
  const { retries = 5, delay = 200, backOff = 'exponential', timeout } = config ?? {};

  const startTime = Date.now();

  for (let i = 0; i < retries; i++) {
    try {
      const axResponse = await apiCallFn(...(apiParams ?? []));
      if (axResponse.status === 429) {
        throw new AxiosError(
          'Rate limit error',
          axResponse.status.toString(),
          apiParams?.[apiParams.length - 1],
          {},
          axResponse
        );
      }
      return axResponse;
    } catch (error) {
      const axError = error as AxiosError;
      // Check if the error is a rate limit error, using the type guard function
      if (axError?.response?.status === 429) {
        // If it's the last attempt, throw the error
        if (i === retries - 1) {
          (error as any).numRetries = retries;
          throw error;
          // throw new Error(`Failed after ${retries} retries.`);
        }

        // Calculate the delay based on the backOff configuration
        let currentDelay = delay;

        if (backOff === 'header') {
          const retryHeader = axError.response.headers?.['retry-after'];
          if (retryHeader) {
            currentDelay = parseInt(retryHeader) * 1000 + 1001; // 1s more
          }
          // TODO: check what happens if we don't have a retry-after header but header mode? for now, we revert to linear
        }

        if (backOff === 'exponential') {
          // Need to do some type magic with config to make it work
          currentDelay *= ((config as any)?.backOffFactor ?? 2) ** i;
        }

        // Check if the current delay exceeds the timeout
        if (timeout !== undefined && Date.now() - startTime + currentDelay > timeout) {
          throw new Error('Operation timed out.');
        }

        // Wait for the specified delay before retrying
        await new Promise((resolve) => setTimeout(resolve, currentDelay));
      } else {
        // If the error is not related to rate limiting, throw the error
        throw error;
      }
    }
  }

  // This line is needed to satisfy TypeScript, but in reality, it should never be reached
  // Reason: try returns. catch->else throws. catch->if will throw on the last attempt,
  // otherwise the loop will be repeated. However, TS cannot reason about this.
  throw new Error('This error should not be reached.');
};
