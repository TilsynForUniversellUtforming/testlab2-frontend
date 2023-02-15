import React from 'react';
import { Button, Modal } from 'react-bootstrap';

export interface Props {
  label?: string;
  show: boolean;
  closeModal: () => void;
  onSubmit: (e: any) => void;
}

const ConfirmDialog = ({ label, show, closeModal, onSubmit }: Props) => {
  const confirmLabel = label ? label : 'Er du sikker?';

  return (
    <>
      <Modal show={show} onHide={closeModal} animation={false} centered>
        <Modal.Body>{confirmLabel}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Lukk
          </Button>
          <Button variant="primary" onClick={onSubmit}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConfirmDialog;
