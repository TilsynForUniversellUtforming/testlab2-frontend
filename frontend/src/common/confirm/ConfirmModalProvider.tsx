import React, { ReactNode, useContext, useRef, useState } from 'react';

import ConfirmDialog from './ConfirmDialog';

type ConfirmData = {
  headerTitle: string;
  message: string;
};

type ConfirmModalContextType = {
  confirm: ({ headerTitle, message }: ConfirmData) => Promise<boolean>;
};

const ConfirmModalContext = React.createContext<ConfirmModalContextType>({
  confirm: async () => false,
});

const ConfirmModalProvider = ({ children }: { children: ReactNode }) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [headerTitle, setHeaderTitle] = useState('');
  const resolver = useRef<(choice: boolean) => void>();

  const confirm = ({ headerTitle, message }: ConfirmData): Promise<boolean> => {
    setMessage(message);
    setHeaderTitle(headerTitle);
    setShow(true);

    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  };

  const handleCancel = () => {
    setShow(false);
    resolver.current && resolver.current(false);
  };

  const handleOk = () => {
    setShow(false);
    resolver.current && resolver.current(true);
  };

  return (
    <ConfirmModalContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDialog
        show={show}
        headerTitle={headerTitle}
        message={message}
        closeModal={handleCancel}
        onSubmit={handleOk}
      />
    </ConfirmModalContext.Provider>
  );
};

const useConfirmModal = (): ConfirmModalContextType =>
  useContext(ConfirmModalContext);

export { ConfirmModalProvider, useConfirmModal };
