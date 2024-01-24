import { TestlabFormButtonStep } from '@common/form/TestlabFormButtons';
import { MaalingStatus } from '@maaling/api/types';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { defaultSakSteps, SakStep, startedSakSteps } from '../types';

/**
 * The current step and state for a Sak form component.
 * @param {number} currentStepIdx - The index of the current step.
 * @param {SakStep[]} steps - The array of Sak steps.
 * @param {SakStep} currentStep - The current Sak step.
 * @param {boolean} isFirstStep - Whether the current step is the first step.
 * @param {boolean} isLastStep - Whether the current step is the last step.
 * @param {() => void} onClickBack - A function to navigate to the previous step.
 * @param {(idx: number) => void} goToStep - A function to navigate to a specific step.
 * @param {() => void} setNextStep - A function to navigate to the next step.
 * @param {() => void} setPreviousStep - A function to navigate to the previous step.
 */
export type FormStepState = {
  currentStepIdx: number;
  nextStepIdx: number;
  steps: SakStep[];
  currentStep: SakStep;
  isLastStep: (stepIdx: number) => boolean;
  buttonStep: TestlabFormButtonStep;
  goToStep: (idx: number) => void;
  setNextStep: () => void;
};

/**
 * A custom hook to manage the state and logic of a Sak form component.
 * @param {MaalingStatus} [maalingStatus] - The status of the current maaling
 * @param {boolean} isEdit=false - Whether the form is in edit mode.
 * @returns {FormStepState} - The current step and state of the form.
 */
const useSakForm = (
  maalingStatus?: MaalingStatus,
  isEdit?: boolean
): FormStepState => {
  const navigate = useNavigate();

  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [nextStepIdx, setNextStepIdx] = useState<number>(1);
  const [steps, setSteps] = useState<SakStep[]>(startedSakSteps);
  const [buttonStep, setButtonStep] = useState<TestlabFormButtonStep>({
    stepType: 'Start',
    onClickBack: () => navigate('/'),
  });

  const isFirstStep = (currentStepIdx: number) => currentStepIdx <= 0;
  const isLastStep = (currentStepIdx: number) =>
    currentStepIdx >= steps.length - 1;

  useEffect(() => {
    const isPlanlegging = maalingStatus === 'planlegging';
    const steps = isPlanlegging ? defaultSakSteps : startedSakSteps;

    setSteps(steps);
    setNextStepIdx(isEdit ? steps.length : 1);
  }, [maalingStatus]);

  const setNextStep = useCallback(() => {
    setNextStepIdx((currentNext) => {
      if (isLastStep(currentStepIdx) || currentNext - currentStepIdx !== 1) {
        return currentNext;
      } else {
        return currentNext + 1;
      }
    });
    setCurrentStepIdx((currentStepIdx) => {
      if (isLastStep(currentStepIdx)) {
        return currentStepIdx;
      } else {
        return currentStepIdx + 1;
      }
    });
  }, [currentStepIdx]);

  const goToStep = useCallback(
    (stepIdx: number) => {
      if (isEdit || stepIdx < currentStepIdx || stepIdx < nextStepIdx) {
        setCurrentStepIdx(stepIdx);
      }
    },
    [isEdit, currentStepIdx]
  );

  const setPreviousStep = useCallback(() => {
    setCurrentStepIdx((currentStepIdx) => {
      if (isFirstStep(currentStepIdx)) {
        return currentStepIdx;
      } else {
        return currentStepIdx - 1;
      }
    });
  }, []);

  useEffect(() => {
    if (isFirstStep(currentStepIdx)) {
      setButtonStep({
        stepType: 'Start',
        onClickBack: () => navigate('/'),
      });
    } else if (isLastStep(currentStepIdx)) {
      setButtonStep({
        stepType: 'Custom',
        customColor: 'success',
        customNextText: 'Lagre og gå til testing',
        onClickBack: setPreviousStep,
      });
    } else {
      setButtonStep({
        stepType: 'Middle',
        onClickBack: setPreviousStep,
      });
    }
  }, [currentStepIdx]);

  return {
    currentStepIdx: currentStepIdx,
    steps: steps,
    currentStep: steps[currentStepIdx],
    isLastStep: isLastStep,
    buttonStep: buttonStep,
    goToStep: goToStep,
    setNextStep: setNextStep,
    nextStepIdx: nextStepIdx,
  };
};

export default useSakForm;
