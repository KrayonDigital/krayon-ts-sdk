import { ChainType, SUPPORTED_CHAIN_TYPES } from '../data/ChainType';
import { EIP155_CHAINS } from '../data/EIP155Data';

export function isValidQualifiedChain(chainTypeAndChain: string) {
  // chainTypeAndChain is a string like "eip155:1" (chainType:chainId)
  // Later on, we might want to add support for other chain types, but for now only support
  // EIP155 chains taken verbatim from the EIP155_CHAINS
  return Object.keys(EIP155_CHAINS).includes(chainTypeAndChain.toString());
}

export function getChainType(blockchain: string): ChainType | null {
    const eipOptions = new Set(Object.entries(EIP155_CHAINS).map(([qualifiedChainId, chainData]) => chainData.blockchain));
    if(eipOptions.has(blockchain as any)) {
      return 'eip155' as ChainType;
    }
    return null;
}


// Create a function that looks up a chain_id based on the blockchain
export function getChainId(blockchain: string | number): number {
  let chainId: number | undefined;
  if (typeof blockchain === 'number') {
    chainId = blockchain;
  }
  // else if blockchain is hexadecimal
  else if (blockchain.toLowerCase().startsWith('0x')) {
    chainId = parseInt(blockchain, 16);
  }

  // TODO: currently, we only support eip155 chains, later on, if we support other chains,
  // we need to add them here
  const allChains = Object.values({ ...EIP155_CHAINS });
  // When we suppose we have a chainId given, we use chainId to search
  if (chainId !== undefined) {
    chainId = allChains.find((chain) => chain.chainId === chainId)?.chainId;
  }
  // otherwise, we use blockchain string to search
  else {
    chainId = allChains.find(
      (chain) => chain.blockchain === blockchain
    )?.chainId;
  }

  // We still didn't find anyghing
  /*   if (chainId === undefined) {
        throw new Error(`Unknown blockchain: ${blockchain}`);
      } */

  return chainId || 0;
}

export function getChainIdHex(blockchain: string | number): string {
  const chainId = getChainId(blockchain);
  // Convert the chainId from number to hex string
  const chainIdHex = '0x' + chainId.toString(16);
  return chainIdHex;
}

export function findBlockchainByChainId(chainId: number, chainType: ChainType = 'eip155') {
  if(chainType === 'eip155') {
    const chainDef = Object.values(EIP155_CHAINS).find(chain => chain.chainId === chainId);
    return chainDef?.blockchain;
  }
  throw new Error(`Unsupported chain id ${chainId} on ${chainType}`);
}

export function parseQualifiedChainId(qualifiedChainID: string): {chainType: ChainType, chainId: number} {
  const [chainType, chainIdStr] = qualifiedChainID.split(':');
  const chainId = parseInt(chainIdStr);

  if(!SUPPORTED_CHAIN_TYPES.includes(chainType as ChainType)) {
    throw new Error(`Unsupported chain type: ${chainType}`);
  }
  if (!isValidQualifiedChain(qualifiedChainID)) {
    throw new Error(`Invalid qualified chain id: ${qualifiedChainID}`);
  }

  return {
    chainType: chainType as ChainType,
    chainId
  };
}
