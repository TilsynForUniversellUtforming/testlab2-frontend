import { Button, ButtonColor } from '@digdir/design-system-react';
import React from 'react';

export type ButtonType = 'add' | 'submit';

export interface Props {
  type: ButtonType;
  label?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
}

const ActionButton = ({ type, label, onClick, disabled = false }: Props) => {
  if (type === 'add') {
    return (
      <Button
        type="button"
        color={ButtonColor.Success}
        onClick={onClick}
        disabled={disabled}
      >
        {label ? label : '+ Legg til'}
      </Button>
    );
  }

  if (type === 'submit') {
    return (
      <Button onClick={onClick} disabled={disabled}>
        {label ? label : 'Lagre'}
      </Button>
    );
  }

  return null;
};

export default ActionButton;
