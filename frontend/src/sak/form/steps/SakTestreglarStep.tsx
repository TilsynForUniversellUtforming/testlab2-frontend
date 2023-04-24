import React from 'react';
import { useForm } from 'react-hook-form';

import TestlabForm from '../../../common/form/TestlabForm';
import { TestlabFormButtonStep } from '../../../common/form/TestlabFormButtons';
import { Option } from '../../../common/types';
import { TestRegelsett } from '../../../testreglar/api/types';
import { SakFormBaseProps, SakFormState } from '../../types';
import Stepper from '../Stepper';

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
    <div className="sak">
      <TestlabForm<SakFormState>
        heading={currentStep.heading}
        subHeading={currentStep.subHeading}
        onSubmit={onSubmit}
        formMethods={formMethods}
      >
        <div className="sak__stepper">
          <Stepper formStepState={formStepState} />
        </div>
        <div className="sak__form">
          <div className="sak__container">
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
          </div>
          <TestlabForm.FormButtons step={buttonStep} />
        </div>
      </TestlabForm>
    </div>
  );
};

export default SakTestreglarStep;
