export type BlockchainTitle = 'ethereum' | 'goerli' | 'sepolia' | 'polygon' | 'mumbai' | string;
export type BlockchainSymbol = 'LINK' | 'USDC' | 'USDT' | 'DAI' | 'UNI' | 'WBTC' | 'ETH' | string;
export interface BlockchainListItem {
  id: string;
  name: string;
  value: string;
  icon: string;
  swap?: boolean;
}
