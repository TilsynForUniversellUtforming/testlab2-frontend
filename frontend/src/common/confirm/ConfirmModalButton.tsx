import { Button, ButtonColor } from '@digdir/design-system-react';
import React from 'react';

import { ConfirmModalProvider, useConfirmModal } from './ConfirmModalProvider';

export interface ConfirmModalProps {
  className?: string;
  title: string;
  message: string;
  onConfirm: () => void;
  disabled?: boolean;
  icon?: JSX.Element;
  color?: ButtonColor;
  dropdownVariant?: boolean;
}

const ConfirmButton = ({
  className,
  title,
  message,
  onConfirm,
  disabled,
  color,
  icon,
  dropdownVariant,
}: ConfirmModalProps) => {
  const confirmModal = useConfirmModal();

  const handleClickConfirmation = async () => {
    const confirmed = await confirmModal.confirm({
      headerTitle: title,
      message: message,
    });
    if (confirmed) {
      onConfirm();
    }
  };

  if (dropdownVariant) {
    return (
      <button
        onClick={handleClickConfirmation}
        className="dropdown-content__button"
        type="button"
      >
        {title}
      </button>
    );
  }

  return (
    <Button
      onClick={handleClickConfirmation}
      disabled={disabled}
      className={className}
      color={color}
      icon={icon}
    >
      {title}
    </Button>
  );
};

const ConfirmModalButton = ({
  className,
  title,
  message,
  onConfirm,
  disabled = false,
  color = ButtonColor.Primary,
  icon,
  dropdownVariant,
}: ConfirmModalProps) => (
  <ConfirmModalProvider>
    <ConfirmButton
      className={className}
      title={title}
      message={message}
      onConfirm={onConfirm}
      disabled={disabled}
      color={color}
      icon={icon}
      dropdownVariant={dropdownVariant}
    />
  </ConfirmModalProvider>
);

export default ConfirmModalButton;
