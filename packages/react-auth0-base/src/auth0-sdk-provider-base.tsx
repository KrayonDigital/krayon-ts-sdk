import React, { PropsWithChildren } from 'react';

import { KrayonSDK } from '@krayon-digital/core-sdk';

export type KrayonAuth0SDKProviderProps = PropsWithChildren<{
  krayonSdkInstance: KrayonSDK;
  loaderComponent?: React.ReactNode | null;
  sdkNotReadyComponent?: React.ReactNode;
}>;
