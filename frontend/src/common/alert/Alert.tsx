import './Alert.scss';

import React from 'react';

export interface AlertProps {
  type: 'error' | 'success';
  message: string;
}

const Alert = ({ type, message }: AlertProps) => (
  <div className="alert-container">
    <div className={`alert ${type}`}>{message}</div>
  </div>
);

export default Alert;
