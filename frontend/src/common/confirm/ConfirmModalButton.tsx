import {
  ButtonColor,
  ButtonColorType,
  ButtonSizeType,
  ButtonVariantType,
} from '@common/types';
import { Button } from '@digdir/design-system-react';
import React from 'react';

import { ConfirmModalProvider, useConfirmModal } from './ConfirmModalProvider';

export interface ConfirmModalProps {
  className?: string;
  title: string;
  message: string;
  onConfirm: () => void;
  disabled?: boolean;
  icon?: JSX.Element;
  color?: ButtonColorType;
  size?: ButtonSizeType;
  variant?: ButtonVariantType;
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
  variant,
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
        variant={variant}
      />
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
      variant={variant}
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
  variant,
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
      variant={variant}
      size={size}
    />
  </ConfirmModalProvider>
);

export default ConfirmModalButton;
