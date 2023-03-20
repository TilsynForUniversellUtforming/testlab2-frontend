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
    return <>{label}</>;
  } else {
    return <Link to={linkPath}>{label}</Link>;
  }
};

const MaalingStatusdiv = ({ label, finished, linkPath }: Props) => {
  return (
    <div>
      {/*md={8}*/}
      <div>
        <StatusLink label={label} finished={finished} linkPath={linkPath} />
      </div>
      {/*md={4}*/}
      <div>
        <StatusIcon finished={finished} />
      </div>
    </div>
  );
};

export default MaalingStatusdiv;
