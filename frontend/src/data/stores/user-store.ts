import type { User } from '@/domain/interfaces/User';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LOCAL_STORAGE_KEYS } from '@/domain/constants/local-storage';

type Props = {
  user: User | null;
  products: string[];
  hasUCs: boolean | null;
};

type ActionsProps = {
  copyWith: (data: Partial<Props>) => void;
  reset: () => void;
};

type StoreProps = Props & ActionsProps;

export const useUserStore = create(
  persist<StoreProps>(
    (set) => ({
      user: null,
      products: [],
      hasUCs: null,
      copyWith: (props) => set(props),
      reset: () => {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.user);

        set({ user: null, products: [], hasUCs: null });
      },
    }),
    { name: LOCAL_STORAGE_KEYS.user }
  )
);
