import { IdToken } from "@auth0/auth0-react";

export type Auth0TokenClaims = { idTokenClaims?: IdToken };
export type OpaqueAuthTokenClaims = {  };

export type AuthClaimProcessor<T> = (claimsParams: T) => Promise<{ authClaims: any; rawUserInfoHeader?: string }>;

export type AuthPlugin = {
  processAuthClaim: AuthClaimProcessor<any>;
};

export type AuthPluginOptions = 
  ({ authProvider: 'auth0' } & Auth0TokenClaims) | 
  ({ authProvider: 'token' } & OpaqueAuthTokenClaims);
// Add another one like so:
// | { authProvider: 'my-custom-provider' } & MyCustomProviderTokenClaims;
// Note that authProvider must correspond to the filename in plugins/auth/
