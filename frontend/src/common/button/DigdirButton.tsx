import { Button } from 'react-bootstrap';

export type ButtonType = 'add';

export interface Props {
  type: ButtonType;
  onClick?: () => void;
  disabled?: boolean;
}

const DigdirButton = ({ type, onClick, disabled = false }: Props) => {
  if (type === 'add') {
    return (
      <Button onClick={onClick} variant="success" disabled={disabled}>
        + Legg til
      </Button>
    );
  }

  return null;
};

export default DigdirButton;
