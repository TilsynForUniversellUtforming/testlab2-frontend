import { Alert } from '@digdir/design-system-react';
import { useEffect, useState } from 'react';

import { Severity } from '../types';

export interface AlertProps {
  message: string;
  severity?: Severity;
  timeout?: number;
}

const AlertTimed = ({
  severity = 'info',
  message,
  timeout = 5000,
}: AlertProps) => {
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, timeout);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return showAlert ? <Alert severity={severity}>{message}</Alert> : null;
};

export default AlertTimed;
