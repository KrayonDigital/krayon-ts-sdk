import { AxiosInstance } from 'axios';
import {
  CreateSubAccount,
  GetOrganizationOptions,
  OrganizationAssetsFilter,
  OrganizationInvitationsFilter,
  OrganizationInvitationsType,
  OrganizationUsersFilter,
  SpendingLimitFilter,
  SubAccountResponse,
} from '../types/organization';
import { DataWrap, KrayonAPICommonOptions, PaginationRequest } from '../types/common';
import { Asset, AssetResponse } from '../types/asset';
import { WhitelistContract } from '../types/whitelist';
import { CreateOrganization, InviteUser, Organization, } from '../types/organization';
import { Pageable } from '../types/pagination';
import { CreateUser, User, UserResponse } from '../types/user';
import { UserSpendingLimit } from '../types/spending-limit';
import { KrayonSDK } from '../main';
import { KrayonAPIClient } from '../api-client';
import { Wallet } from '../types/wallet';
import { GasStationDto } from '../types';

export type OrganizationAssetFilter = Partial<Asset> & PaginationRequest;

export class KrayonOrganizationSDK {
  readonly organizationId?: string;
  readonly apiClient: KrayonAPIClient;

  constructor({ organizationId, apiClient }: { organizationId?: string; apiClient: KrayonSDK['apiClient'] }) {
    this.organizationId = organizationId;
    this.apiClient = apiClient;
  }

  listOrganizationUsers(params?: OrganizationUsersFilter, options?: KrayonAPICommonOptions) {
    if (!this.organizationId) {
      throw new Error('Organization id is required for this operation');
    }
    const { abortSignal } = options || {};
    return this.apiClient.get<UserResponse>(`/organizations/${this.organizationId}/users`, {
      params,
      signal: abortSignal,
    });
  }

  listOrganizationAssets(params?: OrganizationAssetsFilter, options?: KrayonAPICommonOptions) {
    if (!this.organizationId) {
      throw new Error('Organization id is required for this operation');
    }
    const { abortSignal } = options || {};
    return this.apiClient.get<AssetResponse>(`/organizations/${this.organizationId}/assets`, {
      params,
      signal: abortSignal,
    });
  }

  getOrganization(options?: GetOrganizationOptions) {
    // For backward compatibility, allow passing organization id here as an override
    // This should normally not be done/needed snce other organization id shouldn't be accesible
    const { organizationId = this.organizationId, abortSignal } = options || {};
    if (!organizationId) {
      throw new Error('Organization id is required for this operation');
    }
    return this.apiClient.get<DataWrap<Organization>>(`/organizations/${organizationId}`, { signal: abortSignal });
  }

  createOrganization(orgObj: CreateOrganization, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post<DataWrap<Organization>>('/organizations', orgObj, { signal: abortSignal });
  }

  updateOrganization(orgChangesObj: Partial<CreateOrganization>, extraParams?: KrayonAPICommonOptions) {
    if (!this.organizationId) {
      throw new Error('Organization id is required for this operation');
    }
    const { abortSignal } = extraParams || {};
    return this.apiClient.patch<DataWrap<Organization>>(`/organizations/${this.organizationId}`, orgChangesObj, {
      signal: abortSignal,
    });
  }

  inviteUserToOrganization(userObj: InviteUser, extraParams?: KrayonAPICommonOptions) {
    if (!this.organizationId) {
      throw new Error('Organization id is required for this operation');
    }
    const { abortSignal } = extraParams || {};
    return this.apiClient.post<DataWrap<InviteUser>>(`/organizations/${this.organizationId}/invite-user`, userObj, {
      signal: abortSignal,
    });
  }

  listOrganizationInvitations(filterObj?: OrganizationInvitationsFilter, options?: KrayonAPICommonOptions) {
    if (!this.organizationId) {
      throw new Error('Organization id is required for this operation');
    }
    const { abortSignal } = options || {};
    return this.apiClient.get<DataWrap<OrganizationInvitationsType>>(
      `/organizations/${this.organizationId}/invitations`, {
        params: filterObj,
        signal: abortSignal,
    });
  }

  // TODO: check whether we should even allow passing org id? using it now for compatibility with Frontend
  listOrganizationSpendingLimits(
    spendingLimitFilter?: SpendingLimitFilter & { organizationId?: string },
    extraParams?: KrayonAPICommonOptions
  ) {
    const { organizationId, ...params } = spendingLimitFilter || {};
    const usedOrgId = organizationId || this.organizationId; // Must be ||, shouldn't be ??, since we might have a '' as orgId (compatibility)
    if (!usedOrgId) {
      // Must be passed either in filter or in constructor
      throw new Error('Organization id is required for this operation');
    }
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<Pageable<UserSpendingLimit>>(
      `/organizations/${usedOrgId}/spending-limits`, {
        params, // this already contains all the required spending limit params less orgID
        signal: abortSignal,
    });
  }

  getWhitelists(extraParams?: KrayonAPICommonOptions) {
    if (!this.organizationId) {
      throw new Error('Organization id is required for this operation');
    }
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<DataWrap<WhitelistContract[]>>(`/organizations/${this.organizationId}/whitelists`, {
      signal: abortSignal,
    });
  }

  getWalletPolicies(extraParams?: KrayonAPICommonOptions) {
    if (!this.organizationId) {
      throw new Error('Organization id is required for this operation');
    }
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<Pageable<Wallet>>(`/organizations/${this.organizationId}/ext-wallets`, {
      signal: abortSignal,
    });
  }

  getGasStations(extraParams?: KrayonAPICommonOptions) {
    if (!this.organizationId) {
      throw new Error('Organization id is required for this operation');
    }
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<Pageable<GasStationDto>>(`/organizations/${this.organizationId}/gas-stations`, {
      signal: abortSignal,
    });
  }

  updateQuorum(num_quorum: number, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post(
      `/organizations/${this.organizationId}/set-quorum`,
      { num_quorum },
      { signal: abortSignal }
    );
  }

  subAccountBusiness(orgObj: CreateSubAccount, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post<DataWrap<Organization>>(`/organizations/${this.organizationId}/sub-account`, orgObj, {
      signal: abortSignal,
    });
  }

  subAccountIndividual(user: CreateUser, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    const subAccountObj = { ...user, sub_account_type: 'individual' };
    return this.apiClient.post<DataWrap<User>>(`/organizations/${this.organizationId}/sub-account`, subAccountObj, {
      signal: abortSignal,
    });
  }

  listSubAccounts(extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<SubAccountResponse>(`/organizations/${this.organizationId}/sub-accounts`, {
      signal: abortSignal,
    });
  }
  getWallets(organizationId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<Pageable<Wallet>>(`/organizations/${organizationId}/wallets`, {
      signal: abortSignal,
    });
  }
}
