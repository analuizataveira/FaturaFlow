/* eslint-disable no-var */
import { createContext, useContext, useEffect, useState } from "react";

type ModalStackContextType = {
    registerModal: (id: string) => void;
    unregisterModal: (id: string) => void;
    isTopModal: (id: string) => boolean
    modalStack: Array<string>
}

const ModalStackContext = createContext<ModalStackContextType | undefined>(undefined)

export const ModalStackProvider = ({ children }: { children: React.ReactNode }) => {
    const [modalStack, setModalStack] = useState<Array<string>>([])

    const registerModal = (id: string) => {
        var newModalStack = [...modalStack, id]
        console.log('registerModal', newModalStack);
        setModalStack(newModalStack)
    }

    const unregisterModal = (id: string) => {
        var newModalStack = modalStack.filter((modalId) => modalId != id);
        console.log('unregisterModal', newModalStack);
        setModalStack(newModalStack)
    }

    const isTopModal = (id: string) => {
        console.log('isTopModal', modalStack)
        return id === modalStack[modalStack.length - 1]
    }

    useEffect(() => {
        console.log('ModalStackProvider.modalStack', modalStack);
    }, [modalStack])

    return (
        <ModalStackContext.Provider value={{ registerModal, unregisterModal, isTopModal, modalStack }}>
            {children}
        </ModalStackContext.Provider>
    )
}

export const useModalStack = () => {
    const context = useContext(ModalStackContext)
    if (!context) {
        throw new Error("useModalStack must be used within a ModalStackProvider");
    }
    return context;
}