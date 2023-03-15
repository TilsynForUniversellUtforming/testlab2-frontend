import React from 'react';
import { Col, Row } from 'react-bootstrap';
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

const MaalingStatusRow = ({ label, finished, linkPath }: Props) => {
  return (
    <Row>
      <Col md={8}>
        <StatusLink label={label} finished={finished} linkPath={linkPath} />
      </Col>
      <Col md={4}>
        <StatusIcon finished={finished} />
      </Col>
    </Row>
  );
};

export default MaalingStatusRow;
