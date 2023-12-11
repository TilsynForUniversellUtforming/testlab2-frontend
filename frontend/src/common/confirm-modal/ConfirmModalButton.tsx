import {
  ButtonColor,
  ButtonColorType,
  ButtonSize,
  ButtonSizeType,
  ButtonVariant,
  ButtonVariantType,
} from '@common/types';
import { Button, Divider, Modal, Paragraph } from '@digdir/design-system-react';
import React, { useCallback, useRef } from 'react';

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
  iconOnly?: boolean;
}

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
  iconOnly,
}: ConfirmModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const onConfirmModal = useCallback(() => {
    onConfirm();
    modalRef.current?.close();
  }, [onConfirm, modalRef]);

  return (
    <>
      <Button
        onClick={() => modalRef.current?.showModal()}
        disabled={disabled}
        className={className}
        color={color}
        icon={icon}
        size={size}
        variant={variant}
        title={iconOnly ? title : undefined}
      >
        {iconOnly ? null : title}
      </Button>
      <Modal ref={modalRef} onInteractOutside={() => modalRef.current?.close()}>
        <Modal.Header>{title}</Modal.Header>
        <Divider color="subtle" />
        <Modal.Content>
          <Paragraph>{message}</Paragraph>
        </Modal.Content>
        <Modal.Footer>
          <Button
            variant={ButtonVariant.Outline}
            onClick={() => modalRef.current?.close()}
            size={ButtonSize.Small}
          >
            Lukk
          </Button>
          <Button onClick={onConfirmModal} size={ButtonSize.Small}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConfirmModalButton;
