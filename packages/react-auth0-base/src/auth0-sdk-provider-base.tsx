import { PropsWithChildren, ReactNode } from 'react';

import { KrayonSDK } from '@krayon-digital/core-sdk';

export type KrayonAuth0SDKProviderProps = PropsWithChildren<{
  krayonSdkInstance: KrayonSDK;
  loaderComponent?: ReactNode;
  sdkNotReadyComponent?: ReactNode;
}>;
