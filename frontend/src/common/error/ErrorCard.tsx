import './error-card.scss';

import { ButtonColor, ButtonVariant } from '@common/types';
import { Alert, Button, Heading } from '@digdir/design-system-react';
import React from 'react';
import {
  isRouteErrorResponse,
  useAsyncError,
  useRouteError,
} from 'react-router-dom';

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
    <Alert severity="danger">
      <Heading size="large" spacing title={errorHeader}>
        {errorHeader}
      </Heading>
      <div className="error-card__body">{errorText}</div>
      <div className="error-card__button">
        {onClick && (
          <Button
            onClick={onClick}
            color={ButtonColor.Danger}
            variant={ButtonVariant.Outline}
          >
            {buttonText}
          </Button>
        )}
      </div>
    </Alert>
  </div>
);

const ErrorCard = ({
  onClick,
  buttonText,
  errorHeader,
  error,
}: TestlabError) => {
  const routeError = useRouteError();
  const asyncError = useAsyncError() as Error | undefined;
  const isRouteError = isRouteErrorResponse(routeError);

  if (
    typeof error === 'undefined' &&
    typeof asyncError === 'undefined' &&
    !isRouteError
  ) {
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
  } else if (asyncError) {
    return (
      <ErrorContent
        errorHeader={errorHeader ?? 'Uventa feil'}
        errorText={asyncError.message}
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
