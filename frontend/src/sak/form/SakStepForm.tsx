import React, { ReactElement } from 'react';

import { Loeysing } from '../../loeysingar/api/types';
import { TestRegelsett } from '../../testreglar/api/types';
import { User } from '../../user/api/types';
import { SakFormBaseProps } from '../types';
import SakConfirmStep from './steps/confirmation/SakConfirmStep';
import SakLoeysingStep from './steps/loeysing/SakLoeysingStep';
import SakInitStep from './steps/SakInitStep';
import SakTestreglarStep from './steps/SakTestreglarStep';

export interface Props<T> extends SakFormBaseProps {
  error: Error | undefined;
  loading: boolean;
  loeysingList: Loeysing[];
  regelsettList: TestRegelsett[];
  advisors: User[];
}

const SakStepForm = <T extends object>({
  error,
  loading,
  loeysingList,
  regelsettList,
  advisors,
  maalingFormState,
  onSubmit,
  formStepState,
}: Props<T>): ReactElement<T> => {
  const { currentStep } = formStepState;

  switch (currentStep.sakStepType) {
    case 'Init':
      return (
        <SakInitStep
          formStepState={formStepState}
          maalingFormState={maalingFormState}
          onSubmit={onSubmit}
          advisors={advisors}
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
          loeysingList={loeysingList}
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
          regelsettList={regelsettList}
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
          regelsettList={regelsettList}
        />
      );
    default:
      throw Error('Feil skjema');
  }
};

export default SakStepForm;
