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
  display_name: string;
  full_name: string;
  email: string;
  account_type: string;
}

export interface SubAccount {
  id: string;
  sub_account_name: string;
  email: string;
  sub_account_type: string;
  usd_value: number;
}

export type SubAccountResponse = Pageable<SubAccount>;

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
export type GetOrganizationOptions = KrayonAPICommonOptions & { organizationId?: string };
export type OrganizationInvitationsFilter = PaginationRequest;
export type OrganizationInvitationsType = string[];
