// TODO: sort the type out later
export type Auth0TokenClaims = { idTokenClaims?: any };
export type OpaqueAuthTokenClaims = Record<string, any>;

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
