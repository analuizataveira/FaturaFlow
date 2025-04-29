/* eslint-disable react-hooks/exhaustive-deps */
// Modal para abrir um caixa de diálogo com as informações que forem passados por props

import { useEffect, useRef } from "react";
import { useModalStack } from "../context/ModalContext";

interface ModalProps {
    width?: string;
    onCloseClick: () => void;
    isClose?: boolean;
    children: React.ReactNode;
    modalId: string
}

export default function Modal(modalProps: ModalProps) {
    const { modalId, isClose, onCloseClick } = modalProps

    const modalStack = useModalStack()
    const { isTopModal } = modalStack;

    const doc = useRef(document)

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape" && isClose === false && isTopModal(modalId)) {
            onCloseClick();
        }
    };

    useEffect(() => {
        if (isClose === false) {
            modalStack.registerModal(modalId)
        } else {
            modalStack.unregisterModal(modalId)
        }

        return () => {
            modalStack.unregisterModal(modalId)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isClose])

    useEffect(() => {
        doc.current.addEventListener('keydown', handleKeyDown)

        return () => {
            doc.current.removeEventListener('keydown', handleKeyDown)
        }
    })

    useEffect(() => {
        console.log('Modal', modalProps, modalId, modalStack.modalStack)

        if (modalProps.isClose === false) {
            modalStack.registerModal(modalId)
            doc.current.addEventListener('keydown', handleKeyDown)
        }

        else if (modalProps.isClose) {
            modalStack.unregisterModal(modalId)
            doc.current.removeEventListener('keydown', handleKeyDown)
        }
    }, [modalProps.isClose])

    return (
        <div id={modalId} role="dialog" className={`modal ${modalProps.isClose ? '' : 'modal-open'}`}>
            <div className={`absolute modal-box ${modalProps.width != null ? modalProps.width : "w-fit"} max-w-full overflow-hidden pt-10 h-auto box-content`}>
                <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={() => modalProps.onCloseClick()}
                >
                    ✕
                </button>
                <div className="flex flex-col max-h-screen">
                    {modalProps.children}
                </div>
            </div>
        </div>
    )
}
