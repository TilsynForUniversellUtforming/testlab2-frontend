import React from 'react';
import { Button } from 'react-bootstrap';

import { ConfirmModalProvider, useConfirmModal } from './ConfirmModalProvider';

export interface Props {
  className?: string;
  label: string;
  message: string;
  onConfirm: () => void;
  disabled?: boolean;
}

const ConfirmButton = ({
  className,
  label,
  message,
  onConfirm,
  disabled,
}: Props) => {
  const confirmModal = useConfirmModal();

  const handleClickConfirmation = async () => {
    const confirmed = await confirmModal.confirm({
      headerTitle: label,
      message: message,
    });
    if (confirmed) {
      onConfirm();
    }
  };

  return (
    <Button
      onClick={handleClickConfirmation}
      disabled={disabled}
      className={className}
    >
      {label}
    </Button>
  );
};

const ConfirmModalButton = ({
  className,
  label,
  message,
  onConfirm,
  disabled = false,
}: Props) => (
  <ConfirmModalProvider>
    <ConfirmButton
      className={className}
      label={label}
      message={message}
      onConfirm={onConfirm}
      disabled={disabled}
    />
  </ConfirmModalProvider>
);

export default ConfirmModalButton;
