import { AuthClaimProcessor, AuthPlugin, OpaqueAuthTokenClaims } from '../../types/plugins/auth';

// A function to unwrap claims to the format we want - one arbitrary claims (optional)
// And a required rawUserInfoHeader that we send as a string
const processAuthTokenClaim: AuthClaimProcessor<OpaqueAuthTokenClaims> = async (claimsParams) => {
  return {
    // TODO: fix this
    authClaims: {},
    rawUserInfoHeader: "",
  };
};

const OpaqueTokenAuthPlugin: AuthPlugin = {
  processAuthClaim: processAuthTokenClaim,
};

export default OpaqueTokenAuthPlugin;
