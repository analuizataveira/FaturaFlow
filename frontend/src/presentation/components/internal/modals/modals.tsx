import { useModalStore } from '@/data/stores/modal.store';
import { Dialog, DialogContent } from '@/presentation/components/ui/dialog';
import { cn } from '@/utils/cn';

export interface ModalProps {
  id: string;
  isOpen: boolean;
  hasCloseButton?: boolean;
  children: React.ReactNode;
  contentClassName?: string;
  onClose?: () => void;
}
export default function Modals() {
  const { modals, closeModal } = useModalStore();

  return (
    <>
      {modals.map(modal => (
        <Dialog
          key={`modal-${modal.id}`}
          open={modal.isOpen}
          onOpenChange={() => closeModal(modal.id)}
        >
          <DialogContent
            hasCloseButton={modal.hasCloseButton}
            className={cn('max-h-[80vh] w-fit p-0', modal.contentClassName)}
          >
            {modal.children}
          </DialogContent>
        </Dialog>
      ))}
    </>
  );
}
