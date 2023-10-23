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
  if (!show) {
    return null;
  }

  const confirmLabel = message ? message : 'Er du sikker?';

  return (
    <div role="presentation" className="modal-overlay" onClick={closeModal}>
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
  );
};

export default ConfirmDialog;
