import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { KrayonSDK } from '@krayon-digital/core-sdk';
import { SDKReadyStatus } from '@krayon-digital/core-sdk';
import KrayonSdkClientContext from '../../react-auth0-base/src/sdkClientContext';
import { KrayonWithAuth0SDKProviderBase, KrayonAuth0SDKProviderProps } from '../../react-auth0-base/src/auth0-sdk-provider-base';


// This component will basically get the token from auth0 and pass it to the SDK
// And will provide the SDK instance down the line
export const KrayonWithAuth0SDKProvider = (
  props: KrayonAuth0SDKProviderProps,
): JSX.Element | null => {
  return <KrayonWithAuth0SDKProviderBase {...props} auth0Bridge={useAuth0} />;
}
