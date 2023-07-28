import { Pageable } from './pagination';

export interface ApiToken {
  id: number;
  token: string;
  jti: string;
  created_at: string;
  expires_at: string;
  revoked: boolean;
}

export type ApiTokenResponseDto = Pageable<ApiToken>;
