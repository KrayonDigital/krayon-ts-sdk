import React, { createContext } from 'react';
import KrayonSDK from 'sdk/main';

const KrayonSdkClientContext = createContext<KrayonSDK>({} as KrayonSDK);

export default KrayonSdkClientContext;
