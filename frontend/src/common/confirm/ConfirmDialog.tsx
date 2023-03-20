import './confirm-dialog.scss';

import React from 'react';

export interface Props {
  headerTitle?: string;
  message: string;
  show: boolean;
  closeModal: () => void;
  onSubmit: (e: any) => void;
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
            {headerTitle && <div>{headerTitle}</div>}
            <div>{confirmLabel}</div>
            <div>
              {/*variant="secondary"*/}
              <button onClick={closeModal}>Lukk</button>
              {/*variant="primary"*/}
              <button onClick={onSubmit}>OK</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmDialog;
