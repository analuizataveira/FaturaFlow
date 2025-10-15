import { ModalProps } from '@/presentation/components/internal/modals/modals';
import { create } from 'zustand';

type Props = {
  modals: ModalProps[];
  hasOpenedModal: boolean;
};

type ActionsProps = {
  openModal: ({
    id,
    children,
    contentClassName,
    onClose,
    hasCloseButton,
  }: {
    id: string;
    children: React.ReactNode;
    contentClassName?: string;
    onClose?: () => void;
    hasCloseButton?: boolean;
  }) => void;
  closeModal: (id: string) => void;
};

type StoreProps = Props & ActionsProps;

export const useModalStore = create<StoreProps>()(set => ({
  modals: [],
  hasOpenedModal: false,
  openModal: ({ id, children, contentClassName, onClose, hasCloseButton }) =>
    set(prevState => {
      return {
        hasOpenedModal: true,
        modals: [
          ...prevState.modals,
          { id, children, contentClassName, onClose, isOpen: true, hasCloseButton },
        ],
      };
    }),
  closeModal: id =>
    set(prevState => {
      const modal = prevState.modals.find(modal => modal.id === id);
      if (modal && modal.onClose) {
        modal.onClose();
      }
      return {
        hasOpenedModal: prevState.modals.length > 1,
        modals: prevState.modals.filter(modal => modal.id !== id),
      };
    }),
}));
