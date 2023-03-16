import React, { ReactNode, useContext, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

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

      <Modal show={show} onHide={handleCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>{headerTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Lukk
          </Button>
          <Button variant="primary" onClick={handleOk}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </ConfirmModalContext.Provider>
  );
};

const useConfirmModal = (): ConfirmModalContextType =>
  useContext(ConfirmModalContext);

export { ConfirmModalProvider, useConfirmModal };
