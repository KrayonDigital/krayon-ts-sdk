import { Pageable } from './pagination';

export interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_admin: boolean;
  organization: string | null;
  extra_data?: SocialInfo;
  social?: SocialInfo;
  email_verified?: boolean;
  avatar?: string;
  date_joined: Date;
}

export type UserResponse = Pageable<User>;

export type CreateUser = Pick<User, 'first_name' | 'last_name' | 'email' | 'is_admin'>;

export enum UserRole {
  Admin,
  User,
}

interface SocialInfo {
  sub: string;
  name: string;
  locale: string;
  picture: string;
  nickname: string;
  updated_at: string;
}
