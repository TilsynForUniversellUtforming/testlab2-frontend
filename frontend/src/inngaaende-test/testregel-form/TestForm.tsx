import AppTitle from '@common/app-title/AppTitle';
import {
  ErrorMessage,
  Paragraph,
  Radio,
  Textfield,
} from '@digdir/design-system-react';
import { useCallback, useEffect, useState } from 'react';

import { SelectionOutcome, TestingStep } from '../types';

interface Props {
  heading: string;
  steps: Map<string, TestingStep>;
  firstStepKey: string;
}

interface FormStepProps {
  step?: TestingStep;
  stepKey: string;
  onAction: (stepKey: string, selectionOutcome: SelectionOutcome) => void;
}

interface StepProps extends FormStepProps {
  step: TestingStep;
}

const TestFormTekst = ({ step }: StepProps) => {
  const [value, setValue] = useState<string>('');

  return (
    <Textfield
      label={step.heading}
      description={step.description}
      type="text"
      value={String(value)}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

const TestFormInstruksjon = ({ step }: StepProps) => {
  return (
    <>
      <Paragraph>{step.heading}</Paragraph>
      <Paragraph size="small">{step.description}</Paragraph>
    </>
  );
};

const TestFormRadio = ({ step, onAction, stepKey }: StepProps) => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const inputSelectionOutcome = step.input.inputSelectionOutcome.find(
      (iso) => iso.label === value
    );
    if (inputSelectionOutcome) {
      onAction(stepKey, inputSelectionOutcome);
    }
  }, [value]);

  return (
    <Radio.Group
      legend={step.heading}
      description={step.description}
      value={value}
      onChange={setValue}
    >
      {step.input.inputSelectionOutcome.map((u) => (
        <Radio value={u.label || ''} key={u.label}>
          {u.label}
        </Radio>
      ))}
    </Radio.Group>
  );
};

const TestFormStepWrapper = ({ step, stepKey, onAction }: FormStepProps) => {
  // Step = null if avslutt or ikkjeForekomst
  if (stepKey === 'avslutt') {
    return <>Avslutt</>;
  } else if (stepKey === 'ikkjeForekomst') {
    return <>Ikkje forekomst</>;
  } else if (!step) {
    return <ErrorMessage>Fann ikkje steg</ErrorMessage>;
  }

  const inputType = step.input.inputType;

  switch (inputType) {
    case 'tekst':
      return (
        <TestFormTekst step={step} stepKey={stepKey} onAction={onAction} />
      );
    case 'instruksjon':
      return (
        <TestFormInstruksjon
          step={step}
          stepKey={stepKey}
          onAction={onAction}
        />
      );
    case 'radio':
    case 'jaNei':
      return (
        <TestFormRadio step={step} stepKey={stepKey} onAction={onAction} />
      );
  }
};

const TestForm = ({ heading, steps, firstStepKey }: Props) => {
  const [displaySteps, setDisplaySteps] = useState([firstStepKey]);

  const addNextSteps = (
    currentStepKey: string,
    steps: Map<string, TestingStep>
  ) => {
    const nextSteps = [];
    let nextStepKey = currentStepKey;

    while (nextStepKey) {
      const currentStep = steps.get(nextStepKey);
      if (
        !currentStep ||
        currentStep.input.inputType === 'radio' ||
        currentStep.input.inputType === 'jaNei'
      ) {
        break;
      }

      const defaultOutcome = currentStep.input.inputSelectionOutcome?.[0];
      if (defaultOutcome && defaultOutcome.action === 'gaaTil') {
        nextStepKey = defaultOutcome.target;
        nextSteps.push(nextStepKey);
      } else {
        break;
      }
    }

    return nextSteps;
  };

  const updateSteps = useCallback(
    (currentStepKey: string, selectionOutcome: SelectionOutcome) => {
      setDisplaySteps((prevSteps) => {
        let updatedSteps = prevSteps.slice(
          0,
          prevSteps.indexOf(currentStepKey) + 1
        );

        if (selectionOutcome.action === 'gaaTil') {
          updatedSteps.push(selectionOutcome.target);
          const subsequentSteps = addNextSteps(selectionOutcome.target, steps);
          updatedSteps = updatedSteps.concat(subsequentSteps);
        } else if (
          selectionOutcome.action === 'ikkjeForekomst' ||
          selectionOutcome.action === 'avslutt'
        ) {
          updatedSteps.push(selectionOutcome.action);
        }

        return updatedSteps.filter(
          (step, index) => updatedSteps.indexOf(step) === index
        ); // Remove duplicates
      });
    },
    [steps]
  );

  return (
    <div className="test-form">
      <AppTitle heading={heading} />
      <div className="test-form-entry">
        {displaySteps.map((stepKey, index) => {
          console.log(stepKey);
          return (
            <TestFormStepWrapper
              key={index}
              step={steps.get(stepKey)}
              onAction={updateSteps}
              stepKey={stepKey}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TestForm;
