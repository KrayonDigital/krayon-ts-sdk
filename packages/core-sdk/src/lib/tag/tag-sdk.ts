import { Pageable } from '../types/pagination';
import { Tag } from '../types/tag';
import { DataWrap, KrayonAPICommonOptions, PaginationRequest } from '../types/common';
import { KrayonAPIClient } from '../api-client';

export type CreateTagDto = Omit<Tag, 'id'>;
export type UpdateTagDto = Partial<CreateTagDto>;
export type TagFilter = PaginationRequest & { organizationId?: string };

export class KrayonTagSDK {
  readonly apiClient: KrayonAPIClient;
  readonly organizationId?: string;

  constructor({ apiClient, organizationId }: { apiClient: KrayonAPIClient; organizationId?: string }) {
    this.organizationId = organizationId;
    this.apiClient = apiClient;
  }

  createTag(tagData: Partial<Tag>, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.post<DataWrap<Tag>>(`/tags`, tagData, {
      signal: abortSignal,
    });
  }

  listTags(filterObj?: TagFilter, extraParams?: KrayonAPICommonOptions) {
    const { organizationId = this.organizationId, ...params } = filterObj || {};

    const { abortSignal } = extraParams || {};

    // when we remove /organizations/orgid/ from routes we can remove all deps on organizationId
    if (!organizationId) {
      throw new Error('Organization ID is required to get wallets');
    }
    // Slightly hacky - this should probably be part of the Org api
    let endpoint = `/organizations/${organizationId}/tags`;

    return this.apiClient.get<Pageable<Tag>>(endpoint, {
      params,
      signal: abortSignal,
    });
  }

  getTag(tagId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<DataWrap<Tag>>(`/tags/${tagId}`, {
      signal: abortSignal,
    });
  }

  updateTag(tagId: string, tagDataToUpdate: UpdateTagDto, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.patch<DataWrap<Tag>>(`/tags/${tagId}`, tagDataToUpdate, {
      signal: abortSignal,
    });
  }

  deleteTag(tagId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.delete<null>(`/tags/${tagId}`, {
      signal: abortSignal,
    });
  }

  getTagOrganization(tagId: string, extraParams?: KrayonAPICommonOptions) {
    const { abortSignal } = extraParams || {};
    return this.apiClient.get<DataWrap<{ organization_id: string }>>(`/tags/${tagId}/organization`, {
      signal: abortSignal,
    });
  }
}
