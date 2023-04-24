import { Select } from '@digdir/design-system-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import TestlabForm from '../../../common/form/TestlabForm';
import { TestlabFormButtonStep } from '../../../common/form/TestlabFormButtons';
import { SakFormBaseProps, SakFormState } from '../../types';
import Stepper from '../Stepper';

const SakInitStep = ({
  formStepState,
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

  const { heading, subHeading } = formStepState.currentStep;

  return (
    <div className="sak">
      <TestlabForm<SakFormState>
        heading={heading}
        subHeading={subHeading}
        onSubmit={onSubmit}
        formMethods={formMethods}
      >
        <div className="sak__stepper">
          <Stepper formStepState={formStepState} />
        </div>
        <div className="sak__form">
          <div className="sak__container">
            <div className="sak-init">
              <TestlabForm.FormInput<SakFormState>
                label="Tittel"
                name="navn"
                formValidation={{
                  errorMessage: 'Tittel kan ikkje væra tom',
                  validation: { required: true, minLength: 1 },
                }}
              />
              <Select
                disabled
                label="Type sak"
                options={[{ label: 'Type sak', value: 'ts' }]}
              />
            </div>
          </div>
          <TestlabForm.FormButtons step={buttonStep} />
        </div>
      </TestlabForm>
    </div>
  );
};

export default SakInitStep;
