import KrayonSDK from "sdk/main";
import { createAuth0Client } from '@auth0/auth0-spa-js';
import { krayonConfiguration } from "../common/krayon-configuration";

// First, declare a KrayonSDK instance 
const krayonSDK = new KrayonSDK(krayonConfiguration);


// Then, you need to start it with the auth provider and the token
async function startKrayonSDK() {
    const auth0 = await createAuth0Client({
      domain: 'krayon.auth0.com',
      clientId: '...',
    });
    const token = await auth0.getTokenSilently();
    const idTokenClaims = await auth0.getIdTokenClaims();
  
    krayonSDK.start({
      authProvider: 'auth0',
      token,
      idTokenClaims,
    });
}

startKrayonSDK();

export {krayonSDK};
