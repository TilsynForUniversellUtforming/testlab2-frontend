import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useOutletContext, useParams } from 'react-router-dom';

import ErrorCard from '../../common/error/ErrorCard';
import { MaalingContext } from '../types';
import MaalingParametersContainer from './parameters/MaalingParametersContainer';
import MaalingSkeleton from './skeleton/MaalingSkeleton';
import MaalingStatusContainer from './status/MaalingStatusContainer';

const MaalingOverview = () => {
  const {
    contextLoading,
    contextError,
    maaling,
    handleStartCrawling,
    handleStartTest,
  }: MaalingContext = useOutletContext();
  const { id } = useParams();

  if (contextLoading) {
    return <MaalingSkeleton />;
  }

  if (contextError) {
    return <ErrorCard errorText={contextError} />;
  } else if (!maaling || !id) {
    return <ErrorCard errorText="Finner ikkje måling" />;
  }

  return (
    <Container>
      <Row>
        <Col>
          <MaalingParametersContainer id={id} maaling={maaling} />
        </Col>
        <Col>
          <MaalingStatusContainer
            maaling={maaling}
            handleStartCrawling={handleStartCrawling}
            handleStartTest={handleStartTest}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default MaalingOverview;
