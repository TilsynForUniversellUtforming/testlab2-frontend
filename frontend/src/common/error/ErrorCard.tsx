import React from 'react';
import { Alert, Button } from 'react-bootstrap';

interface Props {
  show?: boolean;
  onClick?: () => void;
  buttonText?: string;
  errorHeader?: string;
  errorText?: string;
}

const ErrorCard = ({
  show = true,
  onClick,
  buttonText = 'Prøv igjen',
  errorHeader = 'Noko gjekk gale',
  errorText = 'Ver vennleg og prøv igjen',
}: Props) => (
  <Alert show={show} variant="danger" className="mt-3">
    <Alert.Heading>{errorHeader}</Alert.Heading>
    <p>{errorText}</p>
    {onClick && (
      <>
        <hr />
        <div className="d-flex">
          <Button onClick={onClick} variant="outline-danger">
            {buttonText}
          </Button>
        </div>
      </>
    )}
  </Alert>
);

export default ErrorCard;
