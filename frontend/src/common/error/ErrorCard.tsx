import './error-card.scss';

import { Button, ErrorMessage } from '@digdir/design-system-react';
import React from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

interface ErrorContentProps {
  onClick?: () => void;
  buttonText?: string;
  errorHeader: string;
  errorText: string;
}

export interface TestlabError {
  onClick?: () => void;
  buttonText?: string;
  errorHeader?: string;
  error?: Error;
}

const ErrorContent = ({
  onClick,
  errorHeader,
  errorText,
  buttonText,
}: ErrorContentProps) => (
  <div className="error-card">
    <div className="error-card__content">
      <div className="error-card__header">
        <h2>{errorHeader}</h2>
      </div>
      <div className="error-card__body">
        <p>Melding fra systemet:</p>
        <ErrorMessage>{errorText}</ErrorMessage>
        <br />
        <div className="error-card__button">
          {onClick && <Button onClick={onClick}>{buttonText}</Button>}
        </div>
      </div>
    </div>
  </div>
);

const ErrorCard = ({
  onClick,
  buttonText,
  errorHeader,
  error,
}: TestlabError) => {
  const routeError = useRouteError();
  const isRouteError = isRouteErrorResponse(routeError);

  if (typeof error === 'undefined' && !isRouteError) {
    return null;
  }

  if (isRouteError) {
    if (routeError.status === 401) {
      return (
        <ErrorContent
          errorHeader="Uautorisert"
          errorText="Kallet gjekk ikkje gjennom"
          onClick={onClick}
          buttonText={buttonText}
        />
      );
    } else if (routeError.status === 404) {
      return (
        <ErrorContent
          errorHeader="Ikkje funnet"
          errorText="Kunne ikkje finna ressurs"
          onClick={onClick}
          buttonText={buttonText}
        />
      );
    }

    return (
      <ErrorContent
        errorHeader={routeError.statusText}
        errorText={routeError.data?.message ?? 'Ingen melding fra systemet'}
        onClick={onClick}
        buttonText={buttonText}
      />
    );
  } else {
    return (
      <ErrorContent
        errorHeader={errorHeader ?? 'Uventa feil'}
        errorText={error!.message}
        onClick={onClick}
        buttonText={buttonText}
      />
    );
  }
};

export default ErrorCard;
