import { Loeysing, Utval } from '@loeysingar/api/types';
import { Verksemd } from '@verksemder/api/types';
import React, { ReactElement } from 'react';

import { TestRegelsett } from '../../testreglar/api/types';
import { User } from '../../user/api/types';
import { SakFormBaseProps } from '../types';
import SakStepFormSkeleton from './skeleton/SakStepFormSkeleton';
import SakConfirmStep from './steps/confirmation/SakConfirmStep';
import SakLoeysingStep from './steps/loeysing/SakLoeysingStep';
import SakInitStep from './steps/SakInitStep';
import SakTestreglarStep from './steps/SakTestreglarStep';

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
  advisors,
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
          advisors={advisors}
          onSubmit={onSubmit}
        />
      );
    case 'Loeysing':
      return (
        <SakLoeysingStep
          formStepState={formStepState}
          maalingFormState={maalingFormState}
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
          maalingFormState={maalingFormState}
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
          maalingFormState={maalingFormState}
          advisors={advisors}
          regelsettList={regelsettList}
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
