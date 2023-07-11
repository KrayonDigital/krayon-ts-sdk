// Initialize the SDK instance with the configuration
// This'll basically contain the baseURL
// We export the SDK globally, so that you can use it in the utility functions if you need

import KrayonSDK from "sdk/main";
import { krayonConfiguration } from "../common/krayon-configuration";

export const krayonSdkInstance = new KrayonSDK(krayonConfiguration);
