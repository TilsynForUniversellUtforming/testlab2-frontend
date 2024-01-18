import TestlabDivider from '@common/divider/TestlabDivider';
import { ButtonVariant } from '@common/types';
import { Button, Heading } from '@digdir/design-system-react';
import { ManualElementResultat, Svar } from '@test/api/types';
import { convertToSvarArray } from '@test/util/testregelUtils';
import { useCallback, useEffect, useRef, useState } from 'react';

import { SelectionOutcome, TestStep } from '../types';
import TestFormStepWrapper from './TestFormStepWrapper';
import { TestFormStep } from './types';

interface Props {
  heading: string;
  steps: Map<string, TestStep>;
  firstStepKey: string;
  onClickBack: () => void;
  onClickSave: () => void;
  isEdit: boolean;
  updateResult: (
    answers: Svar[],
    elementOmtale?: string,
    elementResultat?: ManualElementResultat,
    elementUtfall?: string
  ) => void;
}

const TestForm = ({
  heading,
  steps,
  firstStepKey,
  onClickBack,
  onClickSave,
  isEdit,
  updateResult,
}: Props) => {
  const [formSteps, setFormSteps] = useState<TestFormStep[]>([
    { key: firstStepKey },
  ]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFormSteps([{ key: firstStepKey }]);
  }, [steps]);

  const getNextSteps = (
    currentStep: TestFormStep,
    stepsMap: Map<string, TestStep>
  ) => {
    const nextSteps: TestFormStep[] = [];
    let nextStepKey = currentStep.key;

    // Show all steps until there is a step with selection or multiple outcomes
    while (nextStepKey) {
      const currentStepData = stepsMap.get(nextStepKey);
      if (
        !currentStepData ||
        currentStepData.step.input.inputType === 'radio' ||
        currentStepData.step.input.inputType === 'jaNei' ||
        currentStepData.step.input.inputSelectionOutcome.length > 1
      ) {
        break;
      }

      const defaultOutcome =
        currentStepData.step.input.inputSelectionOutcome[0];
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

  const updateAnswers = (
    currentStepKey: string,
    answer: string,
    selectionOutcome?: SelectionOutcome
  ) => {
    if (isEdit) {
      const answers: Svar[] = convertToSvarArray(steps);
      answers.push({ steg: currentStepKey, svar: answer });

      let elementResultat: ManualElementResultat | undefined = undefined;
      let elementUtfall: string | undefined = undefined;
      if (selectionOutcome) {
        if (selectionOutcome.action === 'avslutt') {
          elementUtfall = selectionOutcome.utfall;
          // elementOmtale = findElementOmtaleStep(steps) // TODO impl. funksjon for dette, bruk "element": "x.x" i testregel-json
          switch (selectionOutcome.fasit) {
            case 'Ja':
              elementResultat = 'samsvar';
              break;
            case 'Nei':
              elementResultat = 'brot';
              break;
            case 'Ikkje testbart':
              elementResultat = 'ikkjeTesta';
              break;
            case 'Ikkje forekomst':
              elementResultat = 'ikkjeForekomst';
              break;
            default:
              elementResultat = 'ikkjeTesta';
              break;
          }
        } else if (selectionOutcome.action === 'ikkjeForekomst') {
          elementUtfall = selectionOutcome.utfall;
          elementResultat = 'ikkjeForekomst';
        }
      }
      updateResult(answers, undefined, elementResultat, elementUtfall);
    }
  };

  const updateText = useCallback((currentStepKey: string, answer: string) => {
    updateAnswers(currentStepKey, answer);
  }, []);

  const updateRadio = useCallback(
    (
      currentStepKey: string,
      answer: string,
      selectionOutcome: SelectionOutcome
    ) => {
      updateAnswers(currentStepKey, answer, selectionOutcome);

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

        const nextSteps = updatedSteps.filter(
          (step, index, self) =>
            index === self.findIndex((s) => s.key === step.key)
        );

        return nextSteps;
      });
    },
    [steps, isEdit]
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
            <div key={formStep.key} id={formStep.key}>
              <TestFormStepWrapper
                testingStep={testingStep}
                formStep={formStep}
                updateRadio={updateRadio}
                updateText={updateText}
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
