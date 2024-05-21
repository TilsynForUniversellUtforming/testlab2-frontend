import InitStepContainer from '@maaling/form/form/steps/init/InitStepContainer';
import LoeysingStepContainer from '@maaling/form/form/steps/loeysing/LoeysingStepContainer';
import { FormBaseProps } from '@maaling/types';
import React, { ReactElement } from 'react';

import StepFormSkeleton from './skeleton/SakStepFormSkeleton';
import ConfirmStep from './steps/confirmation/ConfirmStep';
import TestreglarStep from './steps/testreglar/TestreglarStep';

export interface Props extends FormBaseProps {
  error: Error | undefined;
  loading: boolean;
}

const MaalingForm = ({
  error,
  loading,
  maalingFormState,
  onSubmit,
  formStepState,
}: Props): ReactElement => {
  const { currentStep } = formStepState;

  if (loading) {
    return <StepFormSkeleton steps={formStepState.steps} />;
  }

  switch (currentStep.sakStepType) {
    case 'Init':
      return (
        <InitStepContainer
          formStepState={formStepState}
          maalingFormState={maalingFormState}
          onSubmit={onSubmit}
        />
      );
    case 'Loeysing':
      return (
        <LoeysingStepContainer
          formStepState={formStepState}
          maalingFormState={maalingFormState}
          onSubmit={onSubmit}
        />
      );
    case 'Testregel':
      return (
        <TestreglarStep
          formStepState={formStepState}
          maalingFormState={maalingFormState}
          onSubmit={onSubmit}
          error={error}
          loading={loading}
        />
      );
    case 'Confirm':
      return (
        <ConfirmStep
          formStepState={formStepState}
          maalingFormState={maalingFormState}
          onSubmit={onSubmit}
          error={error}
        />
      );
    default:
      throw Error('Feil skjema');
  }
};

export default MaalingForm;
