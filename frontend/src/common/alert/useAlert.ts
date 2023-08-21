import { AlertProps } from '@common/alert/AlertTimed';
import { Severity } from '@common/types';
import { useCallback, useState } from 'react';

const useAlert = () => {
  const [alert, setAlert] = useState<AlertProps | undefined>(undefined);

  const handleSetAlert = useCallback((severity: Severity, message: string) => {
    setAlert({
      severity: severity,
      message: message,
      clearMessage: () => setAlert(undefined),
    });
  }, []);

  return [alert, handleSetAlert] as const;
};

export default useAlert;
