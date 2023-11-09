import './confirm-dialog.scss';

import TestlabDivider from '@common/divider/TestlabDivider';
import { ButtonVariant } from '@common/types';
import { Button, Heading, Paragraph } from '@digdir/design-system-react';
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

  return (
    <div role="presentation" className="modal-overlay" onClick={closeModal}>
      <span className="invisible">Lukk vindu</span>
      <div className="modal-box">
        <div className="modal-box__heading">
          <Heading level={4} size="medium">
            {headerTitle}
          </Heading>
          <TestlabDivider size="xsmall" />
        </div>
        <Paragraph className="modal-box__message" size="small">
          {message}
        </Paragraph>
        <div className="modal-box__buttons">
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
