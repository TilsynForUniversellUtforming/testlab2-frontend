import { Button } from '@digdir/designsystemet-react';
import React from 'react';

export interface Props {
  label: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

const EditButton = ({ label, onClick }: Props) => (
  <Button onClick={onClick} className="text-start p-0">
    {label}
  </Button>
);

export default EditButton;
