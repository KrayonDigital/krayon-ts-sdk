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

// TODO: Add asset logos
const LOGO_BASE_URL = '/chain-logos'

/**
 * Chains
 */
export const EIP155_MAINNET_CHAINS = {
  'eip155:1': {
    chainId: 1,
    name: 'Ethereum',
    logo: `${LOGO_BASE_URL}/eip155-1.png`,
    rgb: '99, 125, 234',
    rpc: 'https://cloudflare-eth.com/',
    blockchain: 'ethereum',
  },
  'eip155:137': {
    chainId: 137,
    name: 'Polygon',
    logo: `${LOGO_BASE_URL}/eip155-137.png`,
    rgb: '130, 71, 229',
    rpc: 'https://polygon-rpc.com/',
    blockchain: 'polygon',
  },
  'eip155:10': {
    chainId: 10,
    name: 'Optimism',
    logo: `${LOGO_BASE_URL}/eip155-10.png`,
    rgb: '233, 1, 1',
    rpc: 'https://mainnet.optimism.io',
    blockchain: 'optimism',
  },
  'eip155:42161': {
    chainId: 42161,
    name: 'Arbitrum',
    logo: `${LOGO_BASE_URL}/eip155-42161.png`,
    rgb: '44, 55, 75',
    rpc: 'https://arb1.arbitrum.io/rpc',
    blockchain: 'arbitrum',
  },
  // "eip155:42220": {
  //   chainId: 42220,
  //   name: 'Celo Mainnet',
  //   logo: `${LOGO_BASE_URL}/eip155-42220.png`,
  //   rgb: '60, 203, 132',
  //   rpc: "https://forno.celo.org",
  //   blockchain: 'celo',
  // },
} as const;

export const EIP155_TEST_CHAINS = {
  'eip155:5': {
    chainId: 5,
    name: 'Ethereum Goerli',
    logo: `${LOGO_BASE_URL}/eip155-1.png`,
    rgb: '99, 125, 234',
    rpc: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    blockchain: 'goerli',
  },
  'eip155:11155111': {
    chainId: 11155111, // 0xaa36a7,
    name: 'Ethereum Sepolia',
    logo: `${LOGO_BASE_URL}/eip155-1.png`,
    rgb: '99, 125, 234',
    rpc: 'https://rpc.sepolia.dev',
    blockchain: 'sepolia',
  },
  'eip155:80001': {
    chainId: 80001,
    name: 'Polygon Mumbai',
    logo: `${LOGO_BASE_URL}/eip155-137.png`,
    rgb: '130, 71, 229',
    rpc: 'https://matic-mumbai.chainstacklabs.com',
    blockchain: 'mumbai',
  },
  // 'eip155:420': {
    //   chainId: 420,
    //   name: 'Optimism Goerli',
    //   logo: `${LOGO_BASE_URL}/eip155-10.png`,
    //   rgb: '235, 0, 25',
    //   rpc: 'https://goerli.optimism.io',
    //   blockchain: 'optimismgoerli',
  // },
  // 'eip155:421611': {
  //   chainId: 421611,
  //   name: 'Arbitrum Rinkeby',
  //   logo: `${LOGO_BASE_URL}/eip155-42161.png`,
  //   rgb: '44, 55, 75',
  //   rpc: 'https://rinkeby.arbitrum.io/rpc',
  //   blockchain: 'arbitrum-rinkeby',
  // },
  // "eip155:44787": {
  //   chainId: 44787,
  //   name: 'Celo Alfajores',
  //   logo: `${LOGO_BASE_URL}/eip155-42220.png`,
  //   rgb: '60, 203, 132',
  //   rpc: "https://alfajores-forno.celo-testnet.org",
  //   blockchain: 'celo-alfajores',
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
