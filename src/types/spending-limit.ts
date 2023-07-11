import { Coin, TimeInterval } from "./wallet";

export interface UserSpendingLimit {
    address: string;
    allowance: number;
    amount_available: number;
    amount_pending: string;
    amount_reserved: number;
    amount_spent: string;
    blockchain: 'ethereum' | 'goerli' | 'sepolia' | 'polygon' | 'mumbai' | string;
    symbol: Coin;
    interval: TimeInterval;
    limit_reset_at: string;
    user: string;
    email?: string;
  }
