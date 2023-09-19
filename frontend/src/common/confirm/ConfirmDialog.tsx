import './confirm-dialog.scss';

import { ButtonVariant } from '@common/types';
import { Button } from '@digdir/design-system-react';
import React from 'react';

export interface Props {
  headerTitle?: string;
  message: string;
  show: boolean;
  closeModal: () => void;
  onSubmit: () => void;
}

const ConfirmDialog = ({
  headerTitle,
  message,
  show,
  closeModal,
  onSubmit,
}: Props) => {
  const confirmLabel = message ? message : 'Er du sikker?';
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };

  return (
    <>
      {show && (
        <div
          role="presentation"
          className="modal-overlay"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
        >
          <span className="invisible">Lukk vindu</span>
          <div className="modal-box">
            {headerTitle && <div className="modal-header">{headerTitle}</div>}
            <div className="modal-text">{confirmLabel}</div>
            <div className="modal-buttons">
              <Button variant={ButtonVariant.Outline} onClick={closeModal}>
                Lukk
              </Button>
              <Button onClick={onSubmit}>OK</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmDialog;
