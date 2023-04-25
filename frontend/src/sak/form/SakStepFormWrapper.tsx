import React, { ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';

import TestlabForm from '../../common/form/TestlabForm';
import { TestlabFormButtonStep } from '../../common/form/TestlabFormButtons';
import { SakFormBaseProps, SakFormState } from '../types';
import Stepper from './Stepper';

export interface Props extends Omit<SakFormBaseProps, 'maalingFormState'> {
  formMethods: UseFormReturn<SakFormState>;
  buttonStep: TestlabFormButtonStep;
  children: ReactNode;
}

const SakStepFormWrapper = ({
  formStepState,
  onSubmit,
  formMethods,
  buttonStep,
  children,
}: Props) => {
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
          <div className="sak__container">{children}</div>
          <TestlabForm.FormButtons step={buttonStep} />
        </div>
      </TestlabForm>
    </div>
  );
};

export default SakStepFormWrapper;
