import React from 'react';

import { Loeysing } from '../../loeysingar/api/types';
import { TestRegelsett } from '../../testreglar/api/types';
import { SakFormState, SakStep } from '../types';
import SakStepForm from './SakStepForm';
import Stepper from './Stepper';

export interface Props {
  currentStep: SakStep;
  steps: SakStep[];
  goToStep: (stepIdx: number) => void;
  setPreviousStep: () => void;
  maalingFormState: SakFormState;
  loading: boolean;
  error: Error | undefined;
  onSubmit: (maalingFormState: SakFormState) => void;
  regelsettList: TestRegelsett[];
  loeysingList: Loeysing[];
}

const SakStepFormContainer = ({
  currentStep,
  steps,
  goToStep,
  setPreviousStep,
  maalingFormState,
  loading,
  error,
  onSubmit,
  regelsettList,
  loeysingList,
}: Props) => (
  <>
    <div className="sak__container">
      <div className="sak__stepper">
        <Stepper currentStep={currentStep} steps={steps} goToStep={goToStep} />
      </div>
      <div className="sak__form">
        <SakStepForm
          maalingFormState={maalingFormState}
          step={currentStep}
          loading={loading}
          error={error}
          onClickBack={setPreviousStep}
          onSubmit={onSubmit}
          regelsettList={regelsettList}
          loeysingList={loeysingList}
        />
      </div>
    </div>
  </>
);

export default SakStepFormContainer;
