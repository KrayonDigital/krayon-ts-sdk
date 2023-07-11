import { Pageable } from './pagination';
import { Coin } from './wallet';

export interface Property {
  trait_type: string;
  value: string;
}
export interface NftItem {
  image: string;
  name: string;
  id: string;
  token_id: string;
  token_standard?: string;
  marketplaces?: {
    [name: string]: {
      image: string;
      url: string;
    };
  };
  attributes?: Property[];
  contract_address: string;
  extra_detail: {
    description: string;
    image: string;
    name: string;
  };
  wallet: string;
  symbol: string;
  owner?: string;
}

export interface CreateNftTransaction {
  to_address: string;
  amount: string;
  wallet: string | undefined;
  token_id: string;
  symbol: string;
  tags?: string[] | undefined;
  note?: string | undefined;
  network: string;
}

export interface NftCollection {
  id: string;
  address: string;
  name: string;
  symbol: Coin;
  blockchain: string;
  logo_uri: string;
  image_url: string;

  // TODO: not clear where these come from, seems backend isn't sending them
  price_floor: number;
  price_change: number;
}

export type NftResponse = Pageable<NftCollection>;
export type NftCollectionResponse = Pageable<NftItem>;
