/* eslint-disable react-hooks/exhaustive-deps */
// Modal para abrir um caixa de diálogo com as informações que forem passadas por props

import { useEffect } from "react";
import { useModalStack } from "../contexts/ModalContext";

interface ModalProps {
  width?: string;
  onCloseClick: () => void;
  isOpen?: boolean;
  children: React.ReactNode;
  modalId: string;
}

export default function Modal({ width, onCloseClick, isOpen = false, children, modalId }: ModalProps) {
  const modalStack = useModalStack();
  const { isTopModal, registerModal, unregisterModal } = modalStack;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isTopModal(modalId)) {
        onCloseClick();
      }
    };

    if (isOpen) {
      registerModal(modalId);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      unregisterModal(modalId);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div id={modalId} role="dialog" className="modal modal-open">
      <div className={`absolute modal-box ${width ?? "w-fit"} max-w-full overflow-hidden pt-10 h-auto box-content`}>
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onCloseClick}
        >
          ✕
        </button>
        <div className="flex flex-col max-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
}
