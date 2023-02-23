import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';

import { AppContext } from '../types';

interface Props {
  show: boolean;
  onClickRetry?: () => void;
  errorText?: string;
}

const ErrorCard = ({
  show,
  onClickRetry,
  errorText = 'Noe gikk galt, vennligst prøv igjen',
}: Props) => {
  const appContext: AppContext = useOutletContext();
  let errorMsg = errorText;
  let clickRetry = onClickRetry;

  if (appContext) {
    const { error, refresh } = appContext;
    clickRetry = onClickRetry ? onClickRetry : refresh;
    errorMsg = error ? error.message : errorText;
  }

  return (
    <Alert show={show} variant="danger" className="mt-3">
      <Alert.Heading>Noe gikk galt</Alert.Heading>
      <p>{errorMsg}</p>
      <hr />
      {clickRetry && (
        <div className="d-flex">
          <Button onClick={clickRetry} variant="outline-danger">
            Hent igjen
          </Button>
        </div>
      )}
    </Alert>
  );
};

export default ErrorCard;
