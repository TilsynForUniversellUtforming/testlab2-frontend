import React, { ReactElement } from 'react';

import { Loeysing } from '../../loeysingar/api/types';
import { TestRegelsett } from '../../testreglar/api/types';
import { SakFormBaseProps, SakFormState, SakStep } from '../types';
import SakConfirmStep from './steps/SakConfirmStep';
import SakInitStep from './steps/SakInitStep';
import SakLoeysingStep from './steps/SakLoeysingStep';
import SakTestreglarStep from './steps/SakTestreglarStep';

export interface Props<T extends SakFormBaseProps> {
  error: any;
  step: SakStep;
  loading: boolean;
  maalingFormState: SakFormState;
  loeysingList: Loeysing[];
  regelsettList: TestRegelsett[];
  onClickBack: () => void;
  onSubmit: (maalingFormState: SakFormState) => void;
}

const SakStepForm = <T extends SakFormBaseProps>({
  step,
  maalingFormState,
  loading,
  error,
  regelsettList,
  loeysingList,
  onClickBack,
  onSubmit,
}: Props<T>): ReactElement<T> => {
  switch (step.sakStepType) {
    case 'Init':
      return (
        <SakInitStep
          maalingFormState={maalingFormState}
          onSubmit={onSubmit}
          heading={step.heading}
          subHeading={step.subHeading}
        />
      );
    case 'Loeysing':
      return (
        <SakLoeysingStep
          error={error}
          loading={loading}
          loeysingList={loeysingList}
          maalingFormState={maalingFormState}
          heading={step.heading}
          subHeading={step.subHeading}
          onSubmit={onSubmit}
          onClickBack={onClickBack}
        />
      );
    case 'Testregel':
      return (
        <SakTestreglarStep
          regelsettList={regelsettList}
          onClickBack={onClickBack}
          heading={step.heading}
          subHeading={step.subHeading}
          onSubmit={onSubmit}
          maalingFormState={maalingFormState}
        />
      );
    case 'Confirm':
      return (
        <SakConfirmStep
          maalingFormState={maalingFormState}
          onSubmit={onSubmit}
          onClickBack={onClickBack}
          heading={step.heading}
          error={error}
          loading={loading}
        />
      );
    default:
      throw Error('Feil skjema');
  }
};

export default SakStepForm;
