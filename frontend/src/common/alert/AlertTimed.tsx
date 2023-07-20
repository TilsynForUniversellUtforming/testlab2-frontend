import { Alert } from '@digdir/design-system-react';
import { useEffect, useState } from 'react';

import { Severity } from '../types';

export interface AlertProps {
  message: string;
  severity?: Severity;
  timeout?: number;
  clearMessage: () => void;
}

const AlertTimed = ({
  severity = 'info',
  message,
  timeout = 5000,
  clearMessage,
}: AlertProps) => {
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
      clearMessage();
    }, timeout);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return showAlert ? <Alert severity={severity}>{message}</Alert> : null;
};

export default AlertTimed;
