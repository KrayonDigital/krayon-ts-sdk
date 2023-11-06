import { useAuth0 } from 'react-native-auth0';
import { KrayonWithAuth0SDKProviderBase, KrayonAuth0SDKProviderProps } from '../../react-auth0-base/src/auth0-sdk-provider-base';


const bridgedUseAuth0 = () => {
  const {
    getCredentials,
    hasValidCredentials,
    isLoading,
    ...rest
  } = useAuth0();

  return {
    isLoading,
    // ...rest,
    // isAuthenticated: hasValidCredentials,
    isAuthenticated: false, // TODO: fiux this
    getAccessTokenSilently: () => getCredentials("openid profile email") as any, // TODO: wip
    getIdTokenClaims: () => getCredentials("openid profile email") as any, // TODO: Fix this
  };
  // return useAuth0();
};



// This component will basically get the token from auth0 and pass it to the SDK
// And will provide the SDK instance down the line
export const KrayonWithAuth0SDKProvider = (
  props: KrayonAuth0SDKProviderProps,
): JSX.Element | null => {
  return <KrayonWithAuth0SDKProviderBase {...props} auth0Bridge={bridgedUseAuth0} />;
}


