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
    //variant="success"
    return (
      <button type="button" onClick={onClick} disabled={disabled}>
        {label ? label : '+ Legg til'}
      </button>
    );
  }

  if (type === 'submit') {
    return (
      <button onClick={onClick} disabled={disabled}>
        {label ? label : 'Lagre'}
      </button>
    );
  }

  return null;
};

export default ActionButton;
