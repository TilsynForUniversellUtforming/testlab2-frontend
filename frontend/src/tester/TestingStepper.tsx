import classNames from 'classnames';
import React from 'react';
import { Col, Container, Row, Stack } from 'react-bootstrap';

import useCurrentStep from './hooks/useCurrentStep';

const TestingStepper = () => {
  const steps = useCurrentStep();

  return (
    <Stack gap={3}>
      <Container>
        {steps.map((sr) => (
          <div key={`row_${sr.route.path}`}>
            <Row
              className={classNames({
                'fw-bold': sr.active,
                'text-primary': sr.active,
              })}
            >
              <Col>{sr.route.navn}</Col>
              <Col className="d-flex align-items-center justify-content-center"></Col>
            </Row>
          </div>
        ))}
      </Container>
    </Stack>
  );
};

export default TestingStepper;
