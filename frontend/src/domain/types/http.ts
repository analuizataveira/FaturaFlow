import { Role } from './user';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T> = new (...args: any[]) => T;

export type UserMetadata = {
  id: string;
  role: Role;
  name?: string;
  email?: string;
  createdAt?: Date;
};

export type JwtPayload = {
  sub: string;
  iat: number;
  exp: number;
} & UserMetadata;

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export interface IResponseError {
  success: false;
  errKey: string;
  message: string;
  friendlyMessage?: string;
}

export type EitherResponse<T, E = IResponseError> = (T & { success: true }) | E;
