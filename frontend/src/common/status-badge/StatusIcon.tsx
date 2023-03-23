import './status-icon.scss';

import React from 'react';

export interface Props {
  finished?: boolean;
}

const Checkmark = () => <>&#10003;</>;
const Cross = () => <>&#10005;</>;

const StatusIcon = ({ finished = false }: Props) => (
  <div className="status-icon" style={{ height: '2rem', width: '2rem' }}>
    {finished ? <Checkmark /> : <Cross />}
  </div>
);

export default StatusIcon;
