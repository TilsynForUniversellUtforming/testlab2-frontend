import { ButtonColor, ButtonSize, ButtonVariant } from '@common/types';
import {
  Button,
  ButtonProps,
  Divider,
  Modal,
  Paragraph,
} from '@digdir/designsystemet-react';
import React, { useCallback, useRef } from 'react';

export type ConfirmModalProps = {
  className?: string;
  title: string;
  message: string;
  onConfirm: () => void;
  disabled?: boolean;
  buttonIcon?: JSX.Element;
};

const ConfirmModalButton = ({
  className,
  title,
  message,
  onConfirm,
  disabled = false,
  color = ButtonColor.Primary,
  buttonIcon,
  variant,
  size,
  icon,
}: ConfirmModalProps & ButtonProps) => {
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
        title={icon ? title : undefined}
      >
        {buttonIcon}
        {icon ? null : title}
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
