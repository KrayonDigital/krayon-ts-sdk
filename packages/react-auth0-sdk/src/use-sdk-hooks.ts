// useKrayonSDK.ts
import { useContext, useEffect, useState } from 'react';
import { KrayonSDK, SDKReadyStatus } from '@krayon/core-sdk';
import KrayonSdkClientContext from './sdkClientContext';

export const useKrayon = (): KrayonSDK => {
  const krayonSDK = useContext(KrayonSdkClientContext);
  if (!krayonSDK) {
    // Type-guard: this shouldn't really happen since we can
    // always fall back to anonymous SDK
    throw new Error('Krayon SDK not initialized');
  }
  return krayonSDK;
};

export const useKrayonSDKStatus = () => {
  const Krayon = useKrayon();
  const [status, setStatus] = useState(Krayon.status);
  useEffect(() => {
    const handleStatusChange = (newStatus: SDKReadyStatus) => {
      setStatus(newStatus);
    };
    Krayon.onReadyStateChange(handleStatusChange);
    return () => Krayon.offReadyStateChange(handleStatusChange);
  });
  return status;
};
