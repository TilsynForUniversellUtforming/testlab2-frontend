import React, { ReactElement } from 'react';

import { Loeysing } from '../../loeysingar/api/types';
import { TestRegelsett } from '../../testreglar/api/types';
import { MaalingFormState, SakFormBaseProps, SakStep } from '../types';
import SakConfirmForm from './steps/SakConfirmForm';
import SakInitForm from './steps/SakInitForm';
import SakLoeysingForm from './steps/SakLoeysingForm';
import SakTestreglarForm from './steps/SakTestreglarForm';

export interface Props<T extends SakFormBaseProps> {
  error: any;
  step: SakStep;
  loading: boolean;
  maalingFormState: MaalingFormState;
  loeysingList: Loeysing[];
  regelsettList: TestRegelsett[];
  onClickBack: () => void;
  onSubmit: (maalingFormState: MaalingFormState) => void;
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
        <SakInitForm
          maalingFormState={maalingFormState}
          onSubmit={onSubmit}
          heading={step.heading}
          subHeading={step.subHeading}
        />
      );
    case 'Loeysing':
      return (
        <SakLoeysingForm
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
        <SakTestreglarForm
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
        <SakConfirmForm
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
