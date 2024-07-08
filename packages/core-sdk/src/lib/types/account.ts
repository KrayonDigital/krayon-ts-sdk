export type BankAccount = {
  id?: string;
  active?: boolean;
  currency?: string;
  account_type?: string;
  beneficiary_address_valid?: boolean;

  bank_name: string;
  account_number: string;
  routing_number: string;
  account_name: string;
  account_owner_name: string;
  address: {
    street_line_1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
};
