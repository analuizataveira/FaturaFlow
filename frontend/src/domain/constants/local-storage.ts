export const LOCAL_STORAGE_KEYS = {
  accessToken: "access_token",
  refreshToken: "refresh_token",
  user: 'user',
} as const;

export type LocalStorageKey =
  (typeof LOCAL_STORAGE_KEYS)[keyof typeof LOCAL_STORAGE_KEYS];
