import React, { PropsWithChildren, useEffect, useState, FC, useContext, createContext } from 'react';
import { useKrayon, useKrayonSDKStatus } from '../../use-sdk-hooks';
import { EIP155RemoteWalet, ChainType, EIP155_CHAINS } from '@krayon/walletconnect-sdk';
// import {  } from '@krayon/walletconnect/data/ChainType';
// import { EIP155_CHAINS } from '@krayon/walletconnect/data/EIP155Data';

type AvailableWalletMap = {
  'eip155': EIP155RemoteWalet[]
};

type AvailableWalletsContextType = {
  status: 'ready' | 'loading' | 'not-loaded' | 'error';
  eip155AvailableWallets: AvailableWalletMap['eip155'];
  eip155AvailableAddresses: string[];
  isWalletAvailable: (address: string, blockchain: string|number, chainType?: ChainType) => boolean;
}

export const AvailableWalletsContext = createContext<AvailableWalletsContextType>({
  status: 'not-loaded',
  eip155AvailableWallets: [],
  eip155AvailableAddresses: [],
  isWalletAvailable: () => false,
});

export const allowedEIP155Blockchains = [...new Set(Object.values(EIP155_CHAINS).map((a) => a.blockchain as string))] as const;

const AvailableWalletsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [status, setStatus] = useState<AvailableWalletsContextType['status']>('not-loaded');
  const [availableWalletMap, setAvailableWalletMap] = useState<AvailableWalletMap>({'eip155': []});

  const Krayon = useKrayon();
  const sdkStatus = useKrayonSDKStatus();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const walletDtos = (await Krayon.wallet.listWallets()).data.data;

        const walletMap = {
          'eip155': walletDtos
                      .filter(w => allowedEIP155Blockchains.includes(w.blockchain))
                      .map((walletDto) => new EIP155RemoteWalet(walletDto, {krayonWalletConnectSdk: Krayon.walletConnect})),
        }
        setAvailableWalletMap(walletMap);
        setStatus('ready');
      } catch (error) {
        console.error('Failed to fetch wallets', error);
        setStatus('error');
      }
    };
    if(status === 'not-loaded' && sdkStatus === 'ready') {
      setStatus('loading');
      fetchData();
    }
  }, [status, sdkStatus]);

  const ctxVal = {
    status,
    // availableWalletsPerChainType: availableWalletMap,
    eip155AvailableWallets: availableWalletMap['eip155'] ?? [],
    eip155AvailableAddresses: [...new Set(availableWalletMap['eip155']?.map(w => w.address))],

    isWalletAvailable: (address: string, blockchain: string|number, chainType: ChainType = 'eip155') => {
      if(chainType === 'eip155') {
        const availableWalletsForAddress = availableWalletMap[chainType]?.filter((wallet) => wallet.address === address);
        if(blockchain) {
          return availableWalletsForAddress?.find((wallet) => wallet.walletInfo.blockchain === blockchain) !== undefined;
        }
        else {
          // In non-blockchain case the wallet is available iff there is exactly one wallet with the given address
          return (availableWalletsForAddress?.length === 1);
        }
      }
      else {
        throw new Error(`Unsupported chain type: ${chainType}`);
      }
    }
  };

  return (
    <AvailableWalletsContext.Provider value={ctxVal}>
      {children}
      {/* {status === 'ready' && children}
      {status === 'loading' && 'Loading wallets...'}
      {status === 'error' && 'Error'} */}
    </AvailableWalletsContext.Provider>
  );
};

export default AvailableWalletsProvider;
