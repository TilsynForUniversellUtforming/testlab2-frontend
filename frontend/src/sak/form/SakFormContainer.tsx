import React, { ReactNode } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { UseFormReturn } from 'react-hook-form';

import TestlabForm from '../../common/form/TestlabForm';
import { TestlabFormButtonStep } from '../../common/form/TestlabFormButtons';
import { SakFormState } from '../types';

export interface Props {
  heading: string;
  subHeading?: string;
  formMethods: UseFormReturn<SakFormState>;
  onSubmit: (maaingFormState: SakFormState) => void;
  buttonStep: TestlabFormButtonStep;
  children: ReactNode;
}

const SakFormContainer = ({
  heading,
  subHeading,
  formMethods,
  onSubmit,
  buttonStep,
  children,
}: Props) => (
  <TestlabForm<SakFormState>
    heading={heading}
    subHeading={subHeading}
    onSubmit={onSubmit}
    formMethods={formMethods}
  >
    <Container>
      <Row className="pb-4">{children}</Row>
      <Row>
        <Col>
          <TestlabForm.FormButtons step={buttonStep} />
        </Col>
      </Row>
    </Container>
  </TestlabForm>
);

export default SakFormContainer;
