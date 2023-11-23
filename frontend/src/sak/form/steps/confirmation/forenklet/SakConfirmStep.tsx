import { SakFormBaseProps, SakFormState } from '@sak/types';
import React from 'react';
import { useForm } from 'react-hook-form';

import SakFormWrapper from '../../../SakFormWrapper';
import SakConfirmContent from './SakConfirmContent';

const SakConfirmStep = ({
  formStepState,
  sakFormState,
  onSubmit,
}: SakFormBaseProps) => {
  const formMethods = useForm<SakFormState>({
    defaultValues: sakFormState,
  });

  return (
    <SakFormWrapper
      formStepState={formStepState}
      onSubmit={onSubmit}
      formMethods={formMethods}
      heading={formStepState.currentStep.heading}
      description={formStepState.currentStep.description}
    >
      <SakConfirmContent maalingFormState={sakFormState} />
    </SakFormWrapper>
  );
};

export default SakConfirmStep;
