import { useState } from 'react';

import { StepType } from '../../common/form/TestlabFormButtons';
import { SakStep } from '../types';

export type CurrentStep = {
  currentStepIdx: number;
  steps: SakStep[];
  currentStep: SakStep;
  isFirstStep: boolean;
  isLastStep: boolean;
  onClickBack: () => void;
  goToStep: (idx: number) => void;
  setNextStep: () => void;
  setPreviousStep: () => void;
};

const useSakForm = (steps: SakStep[]): CurrentStep => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const isFirstStep = currentStepIdx <= 0;
  const isLastStep = currentStepIdx >= steps.length - 1;
  const stepType: StepType = isFirstStep
    ? 'Start'
    : isLastStep
    ? 'Submit'
    : 'Middle';

  const setNextStep = () => {
    setCurrentStepIdx((currentStepIdx) => {
      if (isLastStep) {
        return currentStepIdx;
      } else {
        return currentStepIdx + 1;
      }
    });
  };

  const goToStep = (stepIdx: number) => {
    setCurrentStepIdx(stepIdx);
  };

  const setPreviousStep = () => {
    setCurrentStepIdx((currentStepIdx) => {
      if (isFirstStep) {
        return currentStepIdx;
      } else {
        return currentStepIdx - 1;
      }
    });
  };

  return {
    currentStepIdx: currentStepIdx,
    steps: steps,
    currentStep: steps[currentStepIdx],
    isFirstStep: isFirstStep,
    isLastStep: isLastStep,
    onClickBack: setPreviousStep,
    goToStep: goToStep,
    setNextStep: setNextStep,
    setPreviousStep: setPreviousStep,
  };
};

export default useSakForm;
