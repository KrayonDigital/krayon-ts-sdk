import { BlockchainTitle } from "./blockchain-types";
import { Coin, TimeInterval } from "./util";

export interface UserSpendingLimit {
    address: string;
    allowance: number;
    amount_available: number;
    amount_pending: string;
    amount_reserved: number;
    amount_spent: string;
    blockchain: BlockchainTitle;
    symbol: Coin;
    interval: TimeInterval;
    limit_reset_at: string;
    user: string;
    email?: string;
  }
