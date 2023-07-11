// Initialize the SDK instance with the configuration
// This'll basically contain the baseURL
// We export the SDK globally, so that you can use it in the utility functions if you need

import KrayonSDK from "sdk/main";
import { krayonConfiguration } from "../common/krayon-configuration";

const krayonSdkInstance = new KrayonSDK(krayonConfiguration);

const KRAYON_TOKEN = process.env.KRAYON_TOKEN as string;

await krayonSdkInstance.start({
    authProvider: 'token', 
    token: KRAYON_TOKEN,

});

// Try an API call
const walletsResponse = await krayonSdkInstance.wallet.listWallets();
console.log("Wallets num:", walletsResponse.data.count);
console.log("First page:", walletsResponse.data.data);
