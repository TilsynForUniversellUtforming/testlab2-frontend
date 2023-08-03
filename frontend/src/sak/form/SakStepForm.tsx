import React, { ReactElement } from 'react';

import { SakFormBaseProps } from '../types';
import SakStepFormSkeleton from './skeleton/SakStepFormSkeleton';
import SakConfirmStep from './steps/confirmation/SakConfirmStep';
import SakLoeysingStep from './steps/loeysing/SakLoeysingStep';
import SakInitStep from './steps/SakInitStep';
import SakTestreglarStep from './steps/SakTestreglarStep';

export interface Props extends SakFormBaseProps {
  error: Error | undefined;
  loading: boolean;
}

const SakStepForm = ({
  error,
  loading,
  maalingFormState,
  onSubmit,
  formStepState,
}: Props): ReactElement => {
  const { currentStep } = formStepState;

  if (loading) {
    return <SakStepFormSkeleton steps={formStepState.steps} />;
  }

  switch (currentStep.sakStepType) {
    case 'Init':
      return (
        <SakInitStep
          formStepState={formStepState}
          maalingFormState={maalingFormState}
          onSubmit={onSubmit}
        />
      );
    case 'Loeysing':
      return (
        <SakLoeysingStep
          formStepState={formStepState}
          maalingFormState={maalingFormState}
          onSubmit={onSubmit}
          error={error}
          loading={loading}
        />
      );
    case 'Testregel':
      return (
        <SakTestreglarStep
          formStepState={formStepState}
          maalingFormState={maalingFormState}
          onSubmit={onSubmit}
          error={error}
          loading={loading}
        />
      );
    case 'Confirm':
      return (
        <SakConfirmStep
          formStepState={formStepState}
          maalingFormState={maalingFormState}
          onSubmit={onSubmit}
          error={error}
          loading={loading}
        />
      );
    default:
      throw Error('Feil skjema');
  }
};

export default SakStepForm;
