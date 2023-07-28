export interface WhitelistContract {
  id: string;
  address: string;
  name: string;
  blockchain: string;
  notes: string;
}

export interface WhiteListContractQuery {
  address: string;
  name: string;
  blockchain: string;
  notes: string;
}

export interface WhiteListContractQueryUpdate {
  name: string;
  notes: string;
}
