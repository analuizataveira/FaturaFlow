import { DrawerProps } from '@/presentation/components';
import { create } from 'zustand';

type Props = {
  drawers: DrawerProps[];
  hasOpenedDrawer: boolean;
};

type ActionsProps = {
  openDrawer: ({
    id,
    children,
    contentClassName,
    onClose,
  }: {
    id: string;
    children: React.ReactNode;
    contentClassName?: string;
    onClose?: () => void;
  }) => void;
  closeDrawer: (id: string) => void;
  clearDrawers: () => void;
};

type StoreProps = Props & ActionsProps;

export const useDrawerStore = create<StoreProps>()((set) => ({
  drawers: [],
  hasOpenedDrawer: false,
  openDrawer: ({ id, children, contentClassName, onClose }) =>
    set((prevState) => {
      return {
        hasOpenedDrawer: true,
        drawers: [...prevState.drawers, { id, children, contentClassName, onClose, isOpen: true }],
      };
    }),
  closeDrawer: (id) =>
    set((prevState) => {
      const drawer = prevState.drawers.find((drawer) => drawer.id === id);
      if (drawer && drawer.onClose) {
        drawer.onClose();
      }
      return {
        hasOpenedDrawer: prevState.drawers.length > 1,
        drawers: prevState.drawers.filter((drawer) => drawer.id !== id),
      };
    }),
  clearDrawers: () =>
    set(() => {
      return {
        hasOpenedDrawer: false,
        drawers: [],
      };
    }),
}));
