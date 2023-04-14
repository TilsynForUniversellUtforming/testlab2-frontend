import { Button, ButtonColor } from '@digdir/design-system-react';
import React from 'react';

import { ConfirmModalProvider, useConfirmModal } from './ConfirmModalProvider';

export interface Props {
  className?: string;
  title: string;
  message: string;
  onConfirm: () => void;
  disabled?: boolean;
  icon?: JSX.Element;
  color?: ButtonColor;
}

const ConfirmButton = ({
  className,
  title,
  message,
  onConfirm,
  disabled,
  color,
  icon,
}: Props) => {
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
      />
    );
  }
  return (
    <Button
      onClick={handleClickConfirmation}
      disabled={disabled}
      className={className}
      color={color}
      title={title}
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
}: Props) => (
  <ConfirmModalProvider>
    <ConfirmButton
      className={className}
      title={title}
      message={message}
      onConfirm={onConfirm}
      disabled={disabled}
      color={color}
      icon={icon}
    />
  </ConfirmModalProvider>
);

export default ConfirmModalButton;
