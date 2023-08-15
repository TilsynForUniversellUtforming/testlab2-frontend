import './alert.scss';

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
  timeout = 15000,
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

  if (!showAlert) {
    return null;
  }

  return (
    <div className="alert">
      <Alert severity={severity}>{message}</Alert>
    </div>
  );
};

export default AlertTimed;
