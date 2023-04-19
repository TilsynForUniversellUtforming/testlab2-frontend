import './error-card.scss';

import { Button, FieldSet } from '@digdir/design-system-react';
import classNames from 'classnames';
import React from 'react';

interface Props {
  show?: boolean;
  onClick?: () => void;
  buttonText?: string;
  errorHeader?: string;
  errorText?: string;
  centered?: boolean;
}

const ErrorCard = ({
  show = true,
  onClick,
  buttonText = 'Prøv igjen',
  errorHeader = 'Noko gjekk gale',
  errorText = 'Ver vennleg og prøv igjen',
  centered = false,
}: Props) => (
  <>
    {show && (
      <div className={classNames('error-card', { centered: centered })}>
        <FieldSet description={errorText} legend={errorHeader}>
          {onClick && <Button onClick={onClick}>{buttonText}</Button>}
        </FieldSet>
      </div>
    )}
  </>
);

export default ErrorCard;
