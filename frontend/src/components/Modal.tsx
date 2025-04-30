interface ModalProps {
    width?: string;
    onCloseClick: () => void;
    isOpen: boolean;
    children: React.ReactNode;
  }
  
  export default function Modal(modalProps: ModalProps) {
    return (
      <dialog id="my_modal_1" className={`modal ${modalProps.isOpen ? 'modal-open' : ''}`}>
        <div className={`modal-box ${modalProps.width || "w-fit"} max-w-full overflow-hidden pt-10 h-auto`}>
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={modalProps.onCloseClick}
          >
            ✕
          </button>
          {modalProps.children}
        </div>
      </dialog>
    );
  }