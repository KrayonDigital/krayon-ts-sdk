import { Pageable } from './pagination';
import { KrayonAPICommonOptions, PaginationRequest } from './common';

export interface Organization {
  id: string;
  name: string;
  display_name: string;
  industry: string;
  logo: string;
  phone: string;
  address: string;
  email: string;
  num_admins: number;
  num_quorum: number;
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
