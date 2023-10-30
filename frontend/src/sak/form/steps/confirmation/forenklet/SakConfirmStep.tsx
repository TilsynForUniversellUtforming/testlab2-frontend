import { SakFormBaseProps, SakFormState } from '@sak/types';
import React from 'react';
import { useForm } from 'react-hook-form';

import SakStepFormWrapper from '../../../SakStepFormWrapper';
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
    <SakStepFormWrapper
      formStepState={formStepState}
      onSubmit={onSubmit}
      formMethods={formMethods}
    >
      <SakConfirmContent maalingFormState={sakFormState} />
    </SakStepFormWrapper>
  );
};

export default SakConfirmStep;
