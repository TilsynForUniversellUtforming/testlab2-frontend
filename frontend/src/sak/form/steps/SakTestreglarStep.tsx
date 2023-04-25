import React from 'react';
import { useForm } from 'react-hook-form';

import TestlabForm from '../../../common/form/TestlabForm';
import { TestlabFormButtonStep } from '../../../common/form/TestlabFormButtons';
import { Option } from '../../../common/types';
import { TestRegelsett } from '../../../testreglar/api/types';
import { SakFormBaseProps, SakFormState } from '../../types';
import SakStepFormWrapper from '../SakStepFormWrapper';

interface Props extends SakFormBaseProps {
  regelsettList: TestRegelsett[];
}

const SakTestreglarStep = ({
  regelsettList,
  onSubmit,
  maalingFormState,
  formStepState,
}: Props) => {
  const { currentStep, onClickBack } = formStepState;

  const regelsettOptions: Option[] = regelsettList.map((rs) => ({
    label: rs.namn,
    value: String(rs.id),
  }));

  const formMethods = useForm<SakFormState>({
    defaultValues: maalingFormState,
  });

  const buttonStep: TestlabFormButtonStep = {
    stepType: 'Middle',
    onClickBack: onClickBack,
  };

  return (
    <SakStepFormWrapper
      formStepState={formStepState}
      onSubmit={onSubmit}
      formMethods={formMethods}
      buttonStep={buttonStep}
    >
      <div className="sak-testreglar">
        <TestlabForm.FormSelect<SakFormState>
          label="Testreglar"
          name="regelsettId"
          formValidation={{
            errorMessage: 'Testreglar må veljast',
            validation: { required: true, min: '1' },
          }}
          options={regelsettOptions}
        />
      </div>
    </SakStepFormWrapper>
  );
};

export default SakTestreglarStep;
