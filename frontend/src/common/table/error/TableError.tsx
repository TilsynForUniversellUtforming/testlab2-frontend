import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';

import { TestregelContext } from '../../../testreglar/types';

interface Props {
  show: boolean;
  onClickRetry?: () => void;
  errorText?: string;
}

const TableError = ({
  show,
  onClickRetry,
  errorText = 'Noe gikk galt, vennligst prøv igjen',
}: Props) => {
  // TODO - Pass på at denne alltid kan bruke outletcontext
  const { error, refresh }: TestregelContext = useOutletContext();

  const clickRetry = onClickRetry ? onClickRetry : refresh;
  const errorMsg = error ? error : errorText;

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

export default TableError;
