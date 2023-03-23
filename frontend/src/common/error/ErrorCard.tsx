import './error-card.scss';

import { Button, FieldSet } from '@digdir/design-system-react';
import React from 'react';

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
  <>
    {show && (
      <FieldSet description={errorText} legend={errorHeader}>
        {onClick && <Button onClick={onClick}>{buttonText}</Button>}
      </FieldSet>
    )}
  </>
);

export default ErrorCard;
