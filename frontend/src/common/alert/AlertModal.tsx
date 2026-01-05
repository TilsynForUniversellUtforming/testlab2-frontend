import { AlertProps } from '@common/alert/AlertTimed';
import { Alert, Dialog } from '@digdir/designsystemet-react';
import { forwardRef } from 'react';

export interface AlertModalProps extends AlertProps {
  title: string;
}

const AlertModal = forwardRef<HTMLDialogElement, AlertModalProps>(
  (
    { severity, message, title = 'Noko har skjedd', clearMessage },
    modalRef
  ) => (
    <Dialog.TriggerContext>
      <Dialog.Trigger>Open Dialog</Dialog.Trigger>
      <Dialog>
        <Alert
          data-color={severity}
          role={severity === 'success' ? 'status' : undefined}
        >
          {message}
        </Alert>
      </Dialog>
    </Dialog.TriggerContext>
  )
);

AlertModal.displayName = 'AlertModal';

export default AlertModal;
