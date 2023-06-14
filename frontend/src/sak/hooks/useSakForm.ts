import { useState } from 'react';

import { SakStep } from '../types';

/**
 * The current step and state for a Sak form component.
 * @typedef {Object} CurrentStep
 * @property {number} currentStepIdx - The index of the current step.
 * @property {SakStep[]} steps - The array of Sak steps.
 * @property {SakStep} currentStep - The current Sak step.
 * @property {boolean} isFirstStep - Whether the current step is the first step.
 * @property {boolean} isLastStep - Whether the current step is the last step.
 * @property {() => void} onClickBack - A function to navigate to the previous step.
 * @property {(idx: number) => void} goToStep - A function to navigate to a specific step.
 * @property {() => void} setNextStep - A function to navigate to the next step.
 * @property {() => void} setPreviousStep - A function to navigate to the previous step.
 */
export type FormStepState = {
  currentStepIdx: number;
  nextStepIdx: number;
  steps: SakStep[];
  currentStep: SakStep;
  isFirstStep: boolean;
  isLastStep: boolean;
  onClickBack: () => void;
  goToStep: (idx: number) => void;
  setNextStep: () => void;
};

export interface SakStepProps {
  steps: SakStep[];
  isEdit?: boolean;
}

/**
 * A custom hook to manage the state and logic of a Sak form component.
 * @param {SakStepProps} props - The props for the hook.
 * @param {SakStep[]} props.steps - The array of Sak steps.
 * @param {boolean} [props.isEdit=false] - Whether the form is in edit mode.
 * @returns {FormStepState} - The current step and state of the form.
 */
const useSakForm = ({ steps, isEdit = false }: SakStepProps): FormStepState => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [nextStepIdx, setNextStepIdx] = useState<number>(
    isEdit ? steps.length : 1
  );
  const isFirstStep = currentStepIdx <= 0;
  const isLastStep = currentStepIdx >= steps.length - 1;

  const setNextStep = () => {
    setNextStepIdx((currentNext) => {
      if (isLastStep || currentNext - currentStepIdx !== 1) {
        return currentNext;
      } else {
        return currentNext + 1;
      }
    });
    setCurrentStepIdx((currentStepIdx) => {
      if (isLastStep) {
        return currentStepIdx;
      } else {
        return currentStepIdx + 1;
      }
    });
  };

  const goToStep = (stepIdx: number) => {
    if (stepIdx < currentStepIdx || stepIdx < nextStepIdx) {
      setCurrentStepIdx(stepIdx);
    }
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
    nextStepIdx: nextStepIdx,
  };
};

export default useSakForm;
