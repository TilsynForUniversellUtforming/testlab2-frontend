import { ButtonColor, ButtonColorType, ButtonSizeType } from '@common/types';
import { Button } from '@digdir/design-system-react';
import React from 'react';

import { ConfirmModalProvider, useConfirmModal } from './ConfirmModalProvider';

export type ButtonVariant = 'button' | 'dropdown';

export interface ConfirmModalProps {
  className?: string;
  title: string;
  message: string;
  onConfirm: () => void;
  disabled?: boolean;
  icon?: JSX.Element;
  color?: ButtonColorType;
  buttonVariant?: ButtonVariant;
  size?: ButtonSizeType;
}

const ConfirmButton = ({
  className,
  title,
  message,
  onConfirm,
  disabled,
  color,
  icon,
  size,
  buttonVariant = 'button',
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

  if (icon) {
    return (
      <Button
        onClick={handleClickConfirmation}
        disabled={disabled}
        className={className}
        color={color}
        icon={icon}
        title={title}
        size={size}
      />
    );
  }

  if (buttonVariant === 'dropdown') {
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
      size={size}
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
  buttonVariant,
  size,
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
      buttonVariant={buttonVariant}
      size={size}
    />
  </ConfirmModalProvider>
);

export default ConfirmModalButton;
