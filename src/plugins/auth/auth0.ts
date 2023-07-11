import { AuthClaimProcessor, AuthPlugin, Auth0TokenClaims } from 'sdk/types/plugins/auth';

// A function to unwrap claims to the format we want - one arbitrary claims (optional)
// And a required rawUserInfoHeader that we send as a string
const processAuth0Claim: AuthClaimProcessor<Auth0TokenClaims> = async (claimsParams) => {
  return {
    authClaims: claimsParams.idTokenClaims,
    rawUserInfoHeader: claimsParams.idTokenClaims?.__raw,
  };
};

const Auth0AuthPlugin: AuthPlugin = {
  processAuthClaim: processAuth0Claim,
};

export default Auth0AuthPlugin;
