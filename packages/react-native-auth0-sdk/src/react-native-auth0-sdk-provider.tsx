import { PropsWithChildren, useEffect, useState } from 'react';
import { SDKReadyStatus } from '@krayon-digital/core-sdk';
import { KrayonSdkClientContext, KrayonAuth0SDKProviderProps } from '@krayon-digital/react-auth0-base';
import { useAuth0 } from 'react-native-auth0';

export const KrayonSDKProviderWithAuth0 = (props: PropsWithChildren<KrayonAuth0SDKProviderProps>) => {
  const {
    sdkNotReadyComponent = null,
    children,
    loaderComponent,
    krayonSdkInstance, // for now, required the krayonSdkInstance to be passed in, since we need the base URL
  } = props;

  const {
    isLoading: isAuth0Loading,
    user,
    getCredentials,
  } = useAuth0();

  const isAuth0Authenticated = user !== undefined && user !== null;

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

    (async () => {
      const creds = await getCredentials("openid profile email");
      const token = creds?.accessToken;
      const idTokenClaims = {__raw: creds?.idToken}; // Mimic the auth0 interface for now, later on, change this in the auth0 SDK plugin

      if (!token || !idTokenClaims) {
        throw new Error('No valid claims found in token');
      }
      // Assign the status setter since the krayonSdkInstance.status won't trigger the
      // component rerender by itself
      krayonSdkInstance.onReadyStateChange(setSdkStatus);

      // Actually start the SDK once we have auth0 data
      await krayonSdkInstance.start({
        token,
        idTokenClaims,
        authProvider: 'auth0',
      });
      // console.log("Started SDK with token: ", token, " and idTokenClaims: ", idTokenClaims)
    })();

    // Remove the event listener when the component unmounts
    return () => krayonSdkInstance.offReadyStateChange(setSdkStatus);
  }, [
    isAuth0Authenticated,
    isAuth0Loading,
    getCredentials,
  ]);

  const isSdkReady =
    sdkStatus === SDKReadyStatus.Ready ||
    sdkStatus === SDKReadyStatus.ReadyNotOnboarded;

  return (
    <KrayonSdkClientContext.Provider value={krayonSdkInstance}>
      {(isAuth0Loading || (user && !isSdkReady)) && loaderComponent}
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
}
