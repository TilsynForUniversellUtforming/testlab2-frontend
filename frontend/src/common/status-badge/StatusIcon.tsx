import React from 'react';

export interface Props {
  finished?: boolean;
}

const Checkmark = () => <>&#10003;</>;
const Cross = () => <>&#10005;</>;

const StatusIcon = ({ finished = false }: Props) => (
  <div
    className="d-none d-lg-flex justify-content-center align-items-center border border-1 rounded-circle text-muted"
    style={{ height: '2rem', width: '2rem' }}
  >
    {finished ? <Checkmark /> : <Cross />}
  </div>
);

export default StatusIcon;
