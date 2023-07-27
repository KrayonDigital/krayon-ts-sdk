/**
 * @desc Refference list of eip155 chains
 * @url https://chainlist.org
 */

// TODO: revise this logic, potentially sync with krayon-wallet-service/src/constants/blockchains.ts
// https://krayondigital.atlassian.net/browse/KD-1021

export type TEIP155Chain = keyof typeof EIP155_CHAINS;
export type EIP155ChainInfo = {
  chainId: number;
  name: string;
  logo: string;
  rgb: string;
  rpc: string;
  blockchain: string;
};

/**
 * Chains
 */
export const EIP155_MAINNET_CHAINS = {
  'eip155:1': {
    chainId: 1,
    name: 'Ethereum',
    logo: '/chain-logos/eip155-1.png',
    rgb: '99, 125, 234',
    rpc: 'https://cloudflare-eth.com/',
    blockchain: 'ethereum',
  },
  'eip155:137': {
    chainId: 137,
    name: 'Polygon',
    logo: '/chain-logos/eip155-137.png',
    rgb: '130, 71, 229',
    rpc: 'https://polygon-rpc.com/',
    blockchain: 'polygon',
  },
  // 'eip155:43114': {
  //   chainId: 43114,
  //   name: 'Avalanche C-Chain',
  //   logo: '/chain-logos/eip155-43113.png',
  //   rgb: '232, 65, 66',
  //   rpc: 'https://api.avax.network/ext/bc/C/rpc',
  //   blockchain: 'avalancheCChain',
  // },
  // 'eip155:10': {
  //   chainId: 10,
  //   name: 'Optimism',
  //   logo: '/chain-logos/eip155-10.png',
  //   rgb: '235, 0, 25',
  //   rpc: 'https://mainnet.optimism.io',
  //   blockchain: 'optimism',
  // },
} as const;

export const EIP155_TEST_CHAINS = {
  'eip155:5': {
    chainId: 5,
    name: 'Ethereum Goerli',
    logo: '/chain-logos/eip155-1.png',
    rgb: '99, 125, 234',
    rpc: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    blockchain: 'goerli',
  },
  'eip155:11155111': {
    chainId: 11155111, // 0xaa36a7,
    name: 'Ethereum Sepolia',
    logo: '/chain-logos/eip155-1.png',
    rgb: '99, 125, 234',
    rpc: 'https://rpc.sepolia.dev',
    blockchain: 'goerli',
  },
  'eip155:80001': {
    chainId: 80001,
    name: 'Polygon Mumbai',
    logo: '/chain-logos/eip155-137.png',
    rgb: '130, 71, 229',
    rpc: 'https://matic-mumbai.chainstacklabs.com',
    blockchain: 'mumbai',
  },
  // 'eip155:43113': {
  //   chainId: 43113,
  //   name: 'Avalanche Fuji',
  //   logo: '/chain-logos/eip155-43113.png',
  //   rgb: '232, 65, 66',
  //   rpc: 'https://api.avax-test.network/ext/bc/C/rpc',
  // },
  // 'eip155:420': {
  //   chainId: 420,
  //   name: 'Optimism Goerli',
  //   logo: '/chain-logos/eip155-10.png',
  //   rgb: '235, 0, 25',
  //   rpc: 'https://goerli.optimism.io',
  // },
} as const;

export const EIP155_CHAINS = { ...EIP155_MAINNET_CHAINS, ...EIP155_TEST_CHAINS } as const;

/**
 * Methods
 */
export const EIP155_SIGNING_METHODS = {
  PERSONAL_SIGN: 'personal_sign',
  ETH_SIGN: 'eth_sign',
  ETH_SIGN_TRANSACTION: 'eth_signTransaction',
  ETH_SIGN_TYPED_DATA: 'eth_signTypedData',
  ETH_SIGN_TYPED_DATA_V3: 'eth_signTypedData_v3',
  ETH_SIGN_TYPED_DATA_V4: 'eth_signTypedData_v4',
  ETH_SEND_RAW_TRANSACTION: 'eth_sendRawTransaction',
  ETH_SEND_TRANSACTION: 'eth_sendTransaction',
} as const;
