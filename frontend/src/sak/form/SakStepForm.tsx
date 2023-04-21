import React, { ReactElement } from 'react';

import { Loeysing } from '../../loeysingar/api/types';
import { TestRegelsett } from '../../testreglar/api/types';
import { SakFormBaseProps, SakFormState, SakStep } from '../types';
import SakConfirmStep from './steps/confirmation/SakConfirmStep';
import SakLoeysingStep from './steps/loeysing/SakLoeysingStep';
import SakInitStep from './steps/SakInitStep';
import SakTestreglarStep from './steps/SakTestreglarStep';

export interface Props<T extends SakFormBaseProps> {
  error: any;
  steps: SakStep[];
  goToStep: (stepIdx: number) => void;
  currentStep: SakStep;
  loading: boolean;
  maalingFormState: SakFormState;
  loeysingList: Loeysing[];
  regelsettList: TestRegelsett[];
  onClickBack: () => void;
  onSubmit: (maalingFormState: SakFormState) => void;
}

const SakStepForm = <T extends SakFormBaseProps>({
  steps,
  goToStep,
  currentStep,
  maalingFormState,
  loading,
  error,
  regelsettList,
  loeysingList,
  onClickBack,
  onSubmit,
}: Props<T>): ReactElement<T> => {
  switch (currentStep.sakStepType) {
    case 'Init':
      return (
        <SakInitStep
          steps={steps}
          goToStep={goToStep}
          currentStep={currentStep}
          maalingFormState={maalingFormState}
          onSubmit={onSubmit}
          heading={currentStep.heading}
          subHeading={currentStep.subHeading}
        />
      );
    case 'Loeysing':
      return (
        <SakLoeysingStep
          steps={steps}
          goToStep={goToStep}
          currentStep={currentStep}
          error={error}
          loading={loading}
          loeysingList={loeysingList}
          maalingFormState={maalingFormState}
          heading={currentStep.heading}
          subHeading={currentStep.subHeading}
          onSubmit={onSubmit}
          onClickBack={onClickBack}
        />
      );
    case 'Testregel':
      return (
        <SakTestreglarStep
          steps={steps}
          goToStep={goToStep}
          currentStep={currentStep}
          regelsettList={regelsettList}
          onClickBack={onClickBack}
          heading={currentStep.heading}
          subHeading={currentStep.subHeading}
          onSubmit={onSubmit}
          maalingFormState={maalingFormState}
        />
      );
    case 'Confirm':
      return (
        <SakConfirmStep
          steps={steps}
          goToStep={goToStep}
          currentStep={currentStep}
          maalingFormState={maalingFormState}
          regelsettList={regelsettList}
          onSubmit={onSubmit}
          onClickBack={onClickBack}
          heading={currentStep.heading}
          error={error}
          loading={loading}
        />
      );
    default:
      throw Error('Feil skjema');
  }
};

export default SakStepForm;
