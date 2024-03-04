import { AlertProps } from '@common/alert/AlertTimed';
import { Alert, Modal } from '@digdir/design-system-react';
import { forwardRef } from 'react';

export interface AlertModalProps extends AlertProps {
  title: string;
}

const AlertModal = forwardRef<HTMLDialogElement, AlertModalProps>(
  (
    { severity, message, title = 'Noko har skjedd', clearMessage },
    modalRef
  ) => (
    <Modal ref={modalRef} onInteractOutside={clearMessage}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content>
        <Alert
          severity={severity}
          role={severity === 'success' ? 'status' : undefined}
        >
          {message}
        </Alert>
      </Modal.Content>
    </Modal>
  )
);

AlertModal.displayName = 'AlertModal';

export default AlertModal;
