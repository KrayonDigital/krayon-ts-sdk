import { Pageable } from '../../sdk/types/pagination';
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

export interface CreateOrganization {
  name: string;
  display_name: string;
  industry: string;
  phone: string;
  email: string;
  address: string;
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
