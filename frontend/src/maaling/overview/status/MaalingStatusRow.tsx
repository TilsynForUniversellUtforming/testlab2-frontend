import StatusIcon from '@common/status-badge/StatusIcon';
import React from 'react';
import { Link } from 'react-router-dom';

interface StatusLinkProps {
  label: string;
  showLink: boolean;
  linkPath: string;
}

export interface Props extends StatusLinkProps {
  finished: boolean;
  error: boolean;
}

const StatusLink = ({ label, showLink, linkPath }: StatusLinkProps) => {
  if (!showLink) {
    return <div className="status-icon-wrapper">{label}</div>;
  } else {
    return <Link to={linkPath}>{label}</Link>;
  }
};

const MaalingStatusRow = ({
  label,
  finished,
  showLink,
  linkPath,
  error,
}: Props) => {
  return (
    <>
      <div className="link-text">
        <StatusLink label={label} showLink={showLink} linkPath={linkPath} />
      </div>
      <div className="status-icon-wrapper">
        <StatusIcon finished={finished} error={error} />
      </div>
    </>
  );
};

export default MaalingStatusRow;
