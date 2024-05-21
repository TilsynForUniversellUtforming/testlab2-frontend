import { FormBaseProps, MaalingFormState } from '@maaling/types';
import React from 'react';
import { useForm } from 'react-hook-form';

import FormWrapper from '../../FormWrapper';
import ConfirmContent from './ConfirmContent';

interface Props extends FormBaseProps {
  error: Error | undefined;
}

const ConfirmStep = ({
  formStepState,
  maalingFormState,
  onSubmit,
  error,
}: Props) => {
  const formMethods = useForm<MaalingFormState>({
    defaultValues: maalingFormState,
  });

  return (
    <FormWrapper
      formStepState={formStepState}
      onSubmit={onSubmit}
      formMethods={formMethods}
      heading={formStepState.currentStep.heading}
      description={formStepState.currentStep.description}
    >
      <ConfirmContent maalingFormState={maalingFormState} error={error} />
    </FormWrapper>
  );
};

export default ConfirmStep;
