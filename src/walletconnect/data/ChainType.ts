export const SUPPORTED_CHAIN_TYPES = ['eip155'] as const;
// export const SUPPORTED_CHAIN_TYPES = ['eip155', 'cosmos', 'solana',  'near', 'elrond', 'tron'] as const;

export type ChainType = (typeof SUPPORTED_CHAIN_TYPES)[number];
