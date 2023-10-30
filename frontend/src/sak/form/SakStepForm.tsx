import { Loeysing, Utval } from '@loeysingar/api/types';
import SakInitContainer from '@sak/form/steps/init/SakInitContainer';
import { Verksemd } from '@verksemder/api/types';
import React, { ReactElement } from 'react';

import { TestRegelsett } from '../../testreglar/api/types';
import { User } from '../../user/api/types';
import { SakFormBaseProps } from '../types';
import SakStepFormSkeleton from './skeleton/SakStepFormSkeleton';
import SakConfirmStep from './steps/confirmation/forenklet/SakConfirmStep';
import SakLoeysingStep from './steps/loeysing/forenklet/SakLoeysingStep';
import SakTestreglarStep from './steps/testreglar/forenklet/SakTestreglarStep';

export interface Props extends SakFormBaseProps {
  error: Error | undefined;
  loading: boolean;
  loeysingList: Loeysing[];
  utvalList: Utval[];
  verksemdList: Verksemd[];
  regelsettList: TestRegelsett[];
  advisors: User[];
}

const SakStepForm = ({
  error,
  loading,
  loeysingList,
  utvalList,
  verksemdList,
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
        <SakInitContainer
          formStepState={formStepState}
          sakFormState={sakFormState}
          onSubmit={onSubmit}
        />
      );
    case 'Loeysing':
      return (
        <SakLoeysingStep
          formStepState={formStepState}
          sakFormState={sakFormState}
          loeysingList={loeysingList}
          utvalList={utvalList}
          verksemdList={verksemdList}
          onSubmit={onSubmit}
          error={error}
          loading={loading}
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

export default SakStepForm;
