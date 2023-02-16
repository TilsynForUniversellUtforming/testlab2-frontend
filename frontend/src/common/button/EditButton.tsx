import React from 'react';
import { Button } from 'react-bootstrap';

export interface Props {
  label: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

const EditButton = ({ label, onClick }: Props) => (
  <Button variant="link" onClick={onClick} className="text-start p-0">
    {label}
  </Button>
);

export default EditButton;
