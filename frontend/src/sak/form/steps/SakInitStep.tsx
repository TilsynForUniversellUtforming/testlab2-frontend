import { Select } from '@digdir/design-system-react';
import React from 'react';
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
    </SakFormContainer>
  );
};

export default SakInitStep;
