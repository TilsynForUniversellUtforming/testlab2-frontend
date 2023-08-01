import TestlabForm from '@common/form/TestlabForm';
import { TestlabFormButtonStep } from '@common/form/TestlabFormButtons';
import TestlabFormHeader from '@common/form/TestlabFormHeader';
import React, { ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { SakFormBaseProps, SakFormState } from '../types';
import Stepper from './Stepper';

export interface Props extends Omit<SakFormBaseProps, 'maalingFormState'> {
  formMethods: UseFormReturn<SakFormState>;
  buttonStep: TestlabFormButtonStep;
  hasRequiredFields?: boolean;
  children: ReactNode;
}

const SakStepFormWrapper = ({
  formStepState,
  onSubmit,
  formMethods,
  buttonStep,
  hasRequiredFields = false,
  children,
}: Props) => {
  const { heading, subHeading } = formStepState.currentStep;

  return (
    <div className="sak">
      <TestlabForm<SakFormState> onSubmit={onSubmit} formMethods={formMethods}>
        <Stepper formStepState={formStepState} />
        <div className="sak__form">
          <TestlabFormHeader
            heading={heading}
            subHeading={subHeading}
            hasRequiredFields={hasRequiredFields}
          />
          <div className="sak__container">{children}</div>
          <TestlabForm.FormButtons step={buttonStep} />
        </div>
      </TestlabForm>
    </div>
  );
};

export default SakStepFormWrapper;
