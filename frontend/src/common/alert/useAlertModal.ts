import { AlertModalProps } from '@common/alert/AlertModal';
import { Severity } from '@common/types';
import { useCallback, useRef, useState } from 'react';

const useAlertModal = () => {
  const [alert, setAlert] = useState<AlertModalProps | undefined>(undefined);
  const modalRef = useRef<HTMLDialogElement>(null);

  const handleSetAlert = useCallback(
    (severity: Severity, title: string, message: string) => {
      setAlert({
        title: title,
        severity: severity,
        message: message,
        clearMessage: () => modalRef?.current?.close(),
      });
    },
    []
  );

  return [alert, handleSetAlert, modalRef] as const;
};

export default useAlertModal;
