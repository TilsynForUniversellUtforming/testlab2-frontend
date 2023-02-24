import classNames from 'classnames';
import React from 'react';
import { Col, Container, Row, Stack } from 'react-bootstrap';

import useCurrentStep from './hooks/useCurrentStep';

const TestingStepper = () => {
  const steps = useCurrentStep();

  return (
    <Stack gap={5}>
      <Container>
        {steps.map((sr, idx) => (
          <div key={`row_${sr.route.path}`}>
            <Row className="text-center">
              <Col
                className={classNames({
                  'fw-bold': sr.active,
                  'text-primary': sr.active,
                })}
              >
                {sr.route.navn}
              </Col>
            </Row>
            {idx > 0 && idx < steps.length - 1 && (
              <Col>
                <div
                  className="d-flex justify-content-center"
                  style={{ height: '100px' }}
                >
                  <div
                    className={classNames(
                      { 'bg-primary': sr.active },
                      { 'bg-secondary': !sr.active }
                    )}
                    style={{ width: '.125rem' }}
                  ></div>
                </div>
              </Col>
            )}
          </div>
        ))}
      </Container>
    </Stack>
  );
};

export default TestingStepper;
