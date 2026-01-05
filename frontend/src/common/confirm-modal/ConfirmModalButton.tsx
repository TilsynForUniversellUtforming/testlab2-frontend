import { ButtonColor, ButtonSize, ButtonVariant } from '@common/types';
import {
  Button,
  ButtonProps,
  Divider,
  Dialog,
  Paragraph,
  Heading,
} from '@digdir/designsystemet-react';
import React, { JSX, useCallback, useRef } from 'react';
import { Size } from '@digdir/designsystemet-types';

export type ConfirmModalProps = {
  className?: string;
  title: string;
  message: string;
  onConfirm: () => void;
  disabled?: boolean;
  buttonIcon?: JSX.Element;
  size?: Size;
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
        data-size={size}
        variant={variant}
        title={icon ? title : undefined}
      >
        {buttonIcon}
        {icon ? null : title}
      </Button>
      <Dialog ref={modalRef} closedby={'any'}>
        <Dialog.Block>
          <Heading>{title}</Heading>
        </Dialog.Block>
        <Divider color="subtle" />
        <Dialog.Block>
          <Paragraph>{message}</Paragraph>
        </Dialog.Block>
        <Dialog.Block>
          <Button
            variant={ButtonVariant.Outline}
            onClick={() => modalRef.current?.close()}
            data-size={ButtonSize.Small}
          >
            Lukk
          </Button>
          <Button onClick={onConfirmModal} data-size={ButtonSize.Small}>
            OK
          </Button>
        </Dialog.Block>
      </Dialog>
    </>
  );
};

export default ConfirmModalButton;
