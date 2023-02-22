import classNames from 'classnames';
import React from 'react';
import { Col, Container, Row, Stack } from 'react-bootstrap';

import { testing_steps } from '../common/appRoutes';
import useCurrentStep from './hooks/useCurrentStep';

const TestingStepper = () => {
  const currentStep = useCurrentStep();

  return (
    <Stack gap={3}>
      <Container>
        {testing_steps.map((route, idx) => (
          <div key={`row_${idx}`}>
            <Row
              className={classNames({
                'fw-bold': (currentStep?.step ?? 0) >= idx,
              })}
            >
              <Col
                className={classNames('nav-link disabled', {
                  active: (currentStep?.step ?? 0) >= idx,
                })}
              >
                {route.navn}
              </Col>
              <Col className="d-flex align-items-center justify-content-center"></Col>
            </Row>
          </div>
        ))}
      </Container>
    </Stack>
  );
};

export default TestingStepper;
