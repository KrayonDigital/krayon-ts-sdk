import { Pageable } from './pagination';

export interface Checkout {
  id: string;
  status: string;
  amount: string;
  currency: string;
  description: string;
  payment_method: string;
  return_url: string;
  qr_code: string;
  created_at: string;
}

export type CheckoutResponse = { data: Checkout };
