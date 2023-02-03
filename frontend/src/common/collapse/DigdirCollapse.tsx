import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

export interface Props {
  buttonText: string;
  children: React.ReactElement;
}

const DigdirCollapse = ({ buttonText, children }: Props) => {
  const [open, setOpen] = useState(false);

  console.log('open', open);

  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        aria-controls="Åpne testregelsett"
        aria-expanded={open}
      >
        {buttonText}
      </Button>
      {open && children}
    </>
  );
};

export default DigdirCollapse;
