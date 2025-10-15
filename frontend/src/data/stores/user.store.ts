import { LOCAL_STORAGE_KEYS } from "@/domain/constants/local-storage";
import { createStore } from "lupi";

export const useMeStore = createStore(
  {
    avatar: "",
    accessToken: "",
    refreshToken: "",
  },
  {
    storageKey: LOCAL_STORAGE_KEYS.userStore,
    encryptKey: import.meta.env.USER_ENCRYPT_KEY,
  },
);
