import { createContext } from 'react';
import { KrayonSDK } from '@krayon/core-sdk';

const KrayonSdkClientContext = createContext<KrayonSDK>({} as KrayonSDK);

export default KrayonSdkClientContext;
