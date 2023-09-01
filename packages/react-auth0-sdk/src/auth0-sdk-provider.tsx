import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { KrayonSDK } from '@krayon-digital/core-sdk';
import { SDKReadyStatus } from '@krayon-digital/core-sdk';
import KrayonSdkClientContext from './sdkClientContext';

type KrayonAuth0SDKProviderProps = PropsWithChildren<{
  krayonSdkInstance: KrayonSDK;
  loaderComponent?: React.ReactNode | null;
  sdkNotReadyComponent?: React.ReactNode;
}>;

// This component will basically get the token from auth0 and pass it to the SDK
// And will provide the SDK instance down the line
export const KrayonWithAuth0SDKProvider = (
  props: KrayonAuth0SDKProviderProps
): JSX.Element | null => {
  const {
    children,
    loaderComponent = <div>Loading...</div>,
    sdkNotReadyComponent = null,
    krayonSdkInstance, // for now, required the krayonSdkInstance to be passed in, since we need the base URL
  } = props;

  const {
    isLoading: isAuth0Loading,
    isAuthenticated: isAuth0Authenticated,
    getAccessTokenSilently,
    getIdTokenClaims,
  } = useAuth0();

  // Use the SDK status to not render the children (or render a loader)
  // Even though this mirrors krayonSdkInstance.status, we need to use a state variable
  // that we update when the SDK status changes, since the change in the underlying
  // variable won't rerender the component
  const [sdkStatus, setSdkStatus] = useState<SDKReadyStatus>(
    krayonSdkInstance.status
  );

  useEffect(() => {
    if (!isAuth0Authenticated || isAuth0Loading) {
      return;
    }
    if (krayonSdkInstance.status !== SDKReadyStatus.Anonymous) {
      return;
    }
    // Get auth0 stuff firrst
    Promise.all([getAccessTokenSilently(), getIdTokenClaims()]).then(
      async ([token, idTokenClaims]) => {
        if (!idTokenClaims) {
          throw new Error('No valid claims found in token');
        }
        // Assign the status setter since the krayonSdkInstance.status won't trigger the
        // component rerender by itself
        krayonSdkInstance.onReadyStateChange(setSdkStatus);

        // Actually start the SDK once we have auth0 data
        krayonSdkInstance.start({
          token,
          idTokenClaims,
          authProvider: 'auth0',
        });
      }
    );
    // Remove the event listener when the component unmounts
    return () => krayonSdkInstance.offReadyStateChange(setSdkStatus);
  }, [
    isAuth0Authenticated,
    isAuth0Loading,
    getAccessTokenSilently,
    getIdTokenClaims,
  ]);

  const isSdkReady =
    sdkStatus === SDKReadyStatus.Ready ||
    sdkStatus === SDKReadyStatus.ReadyNotOnboarded;

  return (
    <KrayonSdkClientContext.Provider value={krayonSdkInstance}>
      {(isAuth0Loading || (isAuth0Authenticated && !isSdkReady)) &&
        loaderComponent}
      {!isAuth0Loading && (
        <>
          {/* If SDK is not ready, and we have a sdkNotReadyComponent, render it instead
        Otherwise, just render children
        */}
          {/* If SdK is ready, just render the children */}
          {isSdkReady && children}
          {/* If SDK isn't ready, render children only if we don't have a sdkNotReadyComponent */}
          {/* This is to ensure the proper redirects take place */}
          {!isSdkReady &&
            (sdkNotReadyComponent ? sdkNotReadyComponent : children)}
        </>
      )}
    </KrayonSdkClientContext.Provider>
  );
};
