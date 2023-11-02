import InitStepContainer from '@sak/form/steps/init/InitStepContainer';
import LoeysingStepContainer from '@sak/form/steps/loeysing/LoeysingStepContainer';
import React, { ReactElement } from 'react';

import { TestRegelsett } from '../../testreglar/api/types';
import { User } from '../../user/api/types';
import { SakFormBaseProps } from '../types';
import SakStepFormSkeleton from './skeleton/SakStepFormSkeleton';
import SakConfirmStep from './steps/confirmation/forenklet/SakConfirmStep';
import SakTestreglarStep from './steps/testreglar/forenklet/SakTestreglarStep';

export interface Props extends SakFormBaseProps {
  error: Error | undefined;
  loading: boolean;
  regelsettList: TestRegelsett[];
  advisors: User[];
}

const SakForm = ({
  error,
  loading,
  regelsettList,
  sakFormState,
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
        <InitStepContainer
          formStepState={formStepState}
          sakFormState={sakFormState}
          onSubmit={onSubmit}
        />
      );
    case 'Loeysing':
      return (
        <LoeysingStepContainer
          formStepState={formStepState}
          sakFormState={sakFormState}
          onSubmit={onSubmit}
        />
      );
    case 'Testregel':
      return (
        <SakTestreglarStep
          formStepState={formStepState}
          sakFormState={sakFormState}
          regelsettList={regelsettList}
          onSubmit={onSubmit}
          error={error}
          loading={loading}
        />
      );
    case 'Confirm':
      return (
        <SakConfirmStep
          formStepState={formStepState}
          sakFormState={sakFormState}
          onSubmit={onSubmit}
        />
      );
    default:
      throw Error('Feil skjema');
  }
};

export default SakForm;
