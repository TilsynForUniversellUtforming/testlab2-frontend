import { Button } from 'react-bootstrap';

export type ButtonType = 'add' | 'submit';

export interface Props {
  type: ButtonType;
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const DigdirButton = ({ type, label, onClick, disabled = false }: Props) => {
  if (type === 'add') {
    return (
      <Button onClick={onClick} variant="success" disabled={disabled}>
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

export default DigdirButton;
