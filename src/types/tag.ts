import { Pageable } from './pagination';

export interface Tag {
  id: string;
  label: string;
  color: string;
}

export type TagsResponse = Pageable<Tag>;
