import TestlabDivider from '@common/divider/TestlabDivider';
import { ButtonVariant } from '@common/types';
import { Button, Heading } from '@digdir/design-system-react';
import { Svar } from '@test/api/types';
import { getAnswersFromState, getNextSteps } from '@test/util/testregelUtils';
import { useCallback, useEffect, useRef, useState } from 'react';

import { SelectionOutcome, TestAnswers, TestStep } from '../types';
import TestFormStepWrapper from './TestFormStepWrapper';
import { TestFormStep } from './types';

interface Props {
  heading: string;
  steps: Map<string, TestStep>;
  initStepKey: string;
  onClickBack: () => void;
  onClickSave: () => void;
  updateResult: (testAnswers: TestAnswers) => void;
}

const TestForm = ({
  heading,
  steps,
  initStepKey,
  onClickBack,
  onClickSave,
  updateResult,
}: Props) => {
  const [displaySteps, setDisplaySteps] = useState<TestFormStep[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stepsToShow = getNextSteps(initStepKey, steps);
    setDisplaySteps(stepsToShow);
  }, [steps, initStepKey]);

  const onAnswer = useCallback(
    (answer: Svar, selectionOutcome?: SelectionOutcome) => {
      // If the step has an selectionOutcome it changes the structure of the selection tree, and the
      // previous steps has to be reset.
      const updatedSteps = selectionOutcome
        ? Array.from(steps.entries()).slice(
            0,
            Array.from(steps.entries()).findIndex(
              ([key, _]) => key === answer.steg
            ) + 1
          )
        : steps;

      const updatedStepsMap = new Map(updatedSteps);
      const currentStep = updatedStepsMap.get(answer.steg);

      if (currentStep) {
        currentStep.answer = answer;
        updatedStepsMap.set(answer.steg, currentStep);

        const testAnswers = getAnswersFromState(
          updatedStepsMap,
          selectionOutcome
        );
        updateResult(testAnswers);
      }
    },
    [steps, updateResult]
  );

  useEffect(() => {
    ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [displaySteps]);

  return (
    <div className="test-form" ref={ref}>
      <Heading size="medium" level={3}>
        {heading}
      </Heading>
      <div className="test-form-content">
        {displaySteps.map((formStep) => {
          const testingStep = steps.get(formStep.key);
          return (
            <div key={formStep.key}>
              <TestFormStepWrapper
                testingStep={testingStep}
                formStep={formStep}
                onAnswer={onAnswer}
              />
            </div>
          );
        })}
      </div>
      <TestlabDivider />
      <div className="testregel-form-buttons">
        <Button variant={ButtonVariant.Outline} onClick={onClickBack}>
          Legg til flere testelementer
        </Button>
        <Button onClick={onClickSave}>Lagre og lukk</Button>
      </div>
    </div>
  );
};

export default TestForm;
