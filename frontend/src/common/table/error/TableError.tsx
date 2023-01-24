import React from 'react';
import { Alert, Button } from 'react-bootstrap';

interface Props {
  show: boolean;
  onClickRetry: () => void;
}

const TableError = ({ show, onClickRetry }: Props) => (
  <Alert show={show} variant="danger">
    <Alert.Heading>Noe gikk galt</Alert.Heading>
    <p>Noe gikk galt under henting av testreglar, vennligst prøv igjen.</p>
    <hr />
    <div className="d-flex">
      <Button onClick={onClickRetry} variant="outline-danger">
        Hent igjen
      </Button>
    </div>
  </Alert>
);

export default TableError;
