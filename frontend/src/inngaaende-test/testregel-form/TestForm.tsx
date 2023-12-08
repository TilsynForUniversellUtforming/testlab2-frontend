import { Heading } from '@digdir/design-system-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { SelectionOutcome, TestingStep } from '../types';
import TestFormStepWrapper from './TestFormStepWrapper';
import { TestFormStep } from './types';

interface Props {
  heading: string;
  steps: Map<string, TestingStep>;
  firstStepKey: string;
}

const TestForm = ({ heading, steps, firstStepKey }: Props) => {
  const [formSteps, setFormSteps] = useState<TestFormStep[]>([
    { key: firstStepKey },
  ]);
  const ref = useRef<HTMLDivElement>(null);

  const getNextSteps = (
    currentStep: TestFormStep,
    stepsMap: Map<string, TestingStep>
  ) => {
    const nextSteps: TestFormStep[] = [];
    let nextStepKey = currentStep.key;

    // Show all steps until there is a step with selection or multiple outcomes
    while (nextStepKey) {
      const currentStepData = stepsMap.get(nextStepKey);
      if (
        !currentStepData ||
        currentStepData.input.inputType === 'radio' ||
        currentStepData.input.inputType === 'jaNei' ||
        currentStepData.input.inputSelectionOutcome.length > 1
      ) {
        break;
      }

      const defaultOutcome = currentStepData.input.inputSelectionOutcome[0];
      const defaultOutcomeAction = defaultOutcome.action;
      if (defaultOutcomeAction === 'gaaTil') {
        nextStepKey = defaultOutcome.target;
        nextSteps.push({ key: nextStepKey });
      } else if (defaultOutcomeAction === 'ikkjeForekomst') {
        nextSteps.push({
          key: defaultOutcomeAction,
          utfall: defaultOutcome.utfall,
        });
        break;
      } else if (defaultOutcomeAction === 'avslutt') {
        nextSteps.push({
          key: defaultOutcomeAction,
          utfall: defaultOutcome.utfall,
          fasit: defaultOutcome.fasit,
        });
        break;
      }
    }

    return nextSteps;
  };

  const updateSteps = useCallback(
    (currentStepKey: string, selectionOutcome: SelectionOutcome) => {
      setFormSteps((prevSteps) => {
        let updatedSteps = prevSteps.slice(
          0,
          prevSteps.findIndex((step) => step.key === currentStepKey) + 1
        );

        if (selectionOutcome.action === 'gaaTil') {
          const newStep = { key: selectionOutcome.target };
          updatedSteps.push(newStep);
          const nextSteps = getNextSteps(newStep, steps);
          updatedSteps = updatedSteps.concat(nextSteps);
        } else if (selectionOutcome.action === 'ikkjeForekomst') {
          updatedSteps.push({
            key: selectionOutcome.action,
            utfall: selectionOutcome.utfall,
          });
        } else if (selectionOutcome.action === 'avslutt') {
          updatedSteps.push({
            key: selectionOutcome.action,
            utfall: selectionOutcome.utfall,
            fasit: selectionOutcome.fasit,
          });
        }

        return updatedSteps.filter(
          (step, index, self) =>
            index === self.findIndex((s) => s.key === step.key)
        );
      });
    },
    [steps]
  );

  useEffect(() => {
    ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [formSteps]);

  return (
    <div className="test-form" ref={ref}>
      <Heading size="medium" level={3}>
        {heading}
      </Heading>
      <div className="test-form-content">
        {formSteps.map((formStep) => {
          const testingStep = steps.get(formStep.key);
          return (
            <div key={formStep.key}>
              <TestFormStepWrapper
                testingStep={testingStep}
                formStep={formStep}
                onAction={updateSteps}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestForm;
