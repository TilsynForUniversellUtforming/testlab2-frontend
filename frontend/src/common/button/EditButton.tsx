import React from 'react';

export interface Props {
  label: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

const EditButton = ({ label, onClick }: Props) => (
  // variant="link"
  <button onClick={onClick} className="text-start p-0">
    {label}
  </button>
);

export default EditButton;
