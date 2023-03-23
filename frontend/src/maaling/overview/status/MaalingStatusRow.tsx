import React from 'react';
import { Link } from 'react-router-dom';

import StatusIcon from '../../../common/status-badge/StatusIcon';

export interface Props {
  label: string;
  finished: boolean;
  linkPath: string;
}

const StatusLink = ({ label, finished, linkPath }: Props) => {
  if (!finished) {
    return <div className="status-icon-wrapper">{label}</div>;
  } else {
    return <Link to={linkPath}>{label}</Link>;
  }
};

const MaalingStatusRow = ({ label, finished, linkPath }: Props) => {
  return (
    <>
      <div className="link-text">
        <StatusLink label={label} finished={finished} linkPath={linkPath} />
      </div>
      <div className="status-icon-wrapper">
        <StatusIcon finished={finished} />
      </div>
    </>
  );
};

export default MaalingStatusRow;
