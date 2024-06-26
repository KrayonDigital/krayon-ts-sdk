import { Pageable } from './pagination';
import { KrayonAPICommonOptions, PaginationRequest } from './common';

export type KYBStatus =
  | 'not_started'
  | 'under_review'
  | 'incomplete'
  | 'awaiting_ubo'
  | 'rejected'
  | 'approved';

export interface Organization {
  id: string;
  name: string;
  display_name: string;
  industry: string;
  logo: string;
  phone: string;
  address: string;
  kyb_status: KYBStatus;
  email: string;
  num_admins: number;
  num_quorum: number;
  sub_account_type: SubAccountType;
}

export interface CreateSubAccount {
  type: SubAccountType;
  display_name: string;
  full_name: string;
  email: string;
  account_type: string;
}

export interface SubAccountListItem {
  id: string;
  sub_account_name: string;
  email: string;
  sub_account_type: SubAccountType;
  usd_value: number;
}
export enum SubAccountType {
  BUSINESS = 'business',
  INDIVIDUAL = 'individual',
}
export interface UpdateSubAccount {
  id?: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  address?: string;
  phone?: string;
  email?: string;
  sub_account_type: SubAccountType;
}

export type OrganizationPolcies = {
  allowed_whitelist_recipients_only: boolean;
  send_transfer_notifications_once: boolean;
};
export type SubAccount = UpdateSubAccount;

export type SubAccountResponse = Pageable<SubAccountListItem>;

export interface CreateOrganization {
  name: string;
  display_name: string;
  industry: string;
  phone: string;
  email: string;
  address: string;
  primary_contact?: string;
  logo?: string;
}

export type UploadFile = any;

export type OrganizationTotalBalance = {
  total_usd_balance: number;
  total_pending_usd_balance: number;
};

export interface OrganizationTotalBalanceResponse {
  data: OrganizationTotalBalance;
}

export interface CompanyKYB {
  id: string;
  display_name: string;
  kyb_status: KYBStatus;
  tos_status: 'pending' | 'accepted';
  kyc_link: string;
  kyc_tos_link: string;
  rejection_reasons: [];
}

export interface CompanyVerification {
  company_details: {
    company_name: string;
    company_owner: string;
    legal_structure: string;
    date_of_incorporation: string;
    registered_address: string;
    country_of_incorporation: string;
  };
  directors: [
    {
      first_name: string;
      middle_man: string;
      last_name: string;
      date_of_birth: string;
      nationality: string;
      address: string;
      email: string;
      phone: string;
      pep_status: boolean;
    }[],
  ];
  bank_details: {
    name_of_account_holder: string;
    account_no: string;
    sort_code: string;
    swift_iban: string;
    address: string;
  };
  documents: {
    certificate_of_incorporation: UploadFile;
    company_proof_of_address: UploadFile;
    ubos: UploadFile[];
  };
}

export type OrganizationsResponse = Pageable<Organization>;

export interface InviteUser {
  inviter: string;
  invitee: string;
}

export type SpendingLimitFilter = PaginationRequest;
export type OrganizationUsersFilter = PaginationRequest;
export type OrganizationAssetsFilter = PaginationRequest;
export type GetOrganizationOptions = KrayonAPICommonOptions & {
  organizationId?: string;
};
export type OrganizationInvitationsFilter = PaginationRequest;
export type OrganizationInvitationsType = string[];
