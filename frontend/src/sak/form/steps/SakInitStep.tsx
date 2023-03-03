import React from 'react';
import { Col, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import TestlabForm from '../../../common/form/TestlabForm';
import { TestlabFormButtonStep } from '../../../common/form/TestlabFormButtons';
import { SakFormBaseProps, SakFormState } from '../../types';
import SakFormContainer from '../SakFormContainer';

const SakInitStep = ({
  heading,
  subHeading,
  maalingFormState,
  onSubmit,
}: SakFormBaseProps) => {
  const navigate = useNavigate();

  const formMethods = useForm<SakFormState>({
    defaultValues: maalingFormState,
  });

  const buttonStep: TestlabFormButtonStep = {
    stepType: 'Start',
    onClickBack: () => navigate('/'),
  };

  return (
    <SakFormContainer
      heading={heading}
      subHeading={subHeading}
      formMethods={formMethods}
      onSubmit={onSubmit}
      buttonStep={buttonStep}
    >
      <Col md={8}>
        <TestlabForm.FormInput
          label="Tittel"
          name="navn"
          formValidation={{
            errorMessage: 'Tittel kan ikkje væra tom',
            validation: { required: true, minLength: 1 },
          }}
        />
        <Form.Label column htmlFor="type-sak" className="p-0">
          Type sak
        </Form.Label>
        <Form.Select id="type-sak" disabled>
          <option>Type sak</option>
        </Form.Select>
      </Col>
    </SakFormContainer>
  );
};

export default SakInitStep;
