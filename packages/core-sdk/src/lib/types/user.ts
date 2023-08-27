import { Election } from './election';
import { Pageable } from './pagination';

export interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_admin: boolean;
  role: string;
  organization: string | null;
  extra_data?: SocialInfo;
  social?: SocialInfo;
  email_verified?: boolean;
  avatar?: string;
  date_joined: Date;
}

export type UserResponse = Pageable<User>;

export type CreateUser = Pick<
  User,
  'first_name' | 'last_name' | 'email' | 'role'
>;

export enum UserRole {
  ADMIN = 'admin', // "An admin user on an organization"
  USER = 'user', // "A user on an organization"
  USER_APPROVER = 'user_approver', // "A user-approver user on an organization"
  SUB_ACCOUNT_USER = 'sub_account_user', // Owner: "A sub-account user on an organization"
}

interface SocialInfo {
  sub: string;
  name: string;
  locale: string;
  picture: string;
  nickname: string;
  updated_at: string;
  org_id?: string; // gets the current organization id from the social provider
}

export enum AssignUserToWalletsStatus {
  AWAITING_MPA = 'AWAITING_MPA',
  PROCESSED = 'PROCESSED',
  ERROR = 'ERROR',
}

export interface AssignWalletsResponse {
  status: string;
  wallet: string;
  result?: string;
  election?: Election;
}
