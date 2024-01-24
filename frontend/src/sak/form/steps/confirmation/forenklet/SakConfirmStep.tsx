import { SakFormBaseProps, SakFormState } from '@sak/types';
import React from 'react';
import { useForm } from 'react-hook-form';

import SakFormWrapper from '../../../SakFormWrapper';
import SakConfirmContent from './SakConfirmContent';

interface Props extends SakFormBaseProps {
  error: Error | undefined;
}

const SakConfirmStep = ({
  formStepState,
  sakFormState,
  onSubmit,
  error,
}: Props) => {
  const formMethods = useForm<SakFormState>({
    defaultValues: sakFormState,
  });

  let formStep = formStepState;
  if (sakFormState?.sakType !== 'Forenklet kontroll') {
    formStep = {
      ...formStep,
      buttonStep: { ...formStep?.buttonStep, customNextText: 'Start test' },
    };
  }

  return (
    <SakFormWrapper
      formStepState={formStep}
      onSubmit={onSubmit}
      formMethods={formMethods}
      heading={formStepState.currentStep.heading}
      description={formStepState.currentStep.description}
    >
      <SakConfirmContent maalingFormState={sakFormState} error={error} />
    </SakFormWrapper>
  );
};

export default SakConfirmStep;
