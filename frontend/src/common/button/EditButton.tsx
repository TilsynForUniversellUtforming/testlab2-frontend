import React from 'react';
import { Button } from 'react-bootstrap';

export interface Props {
  label: string;
  onClick: (e: any) => void;
}

const EditButton = ({ label, onClick }: Props) => (
  <Button variant="link" onClick={onClick} className="text-start p-0">
    {label}
  </Button>
);

export default EditButton;
