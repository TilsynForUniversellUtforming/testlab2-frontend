import { ErrorMessage } from '@digdir/design-system-react';
import TestFormDescription from '@test/testregel-form/input/TestFormDescription';
import TestFormInputRadio from '@test/testregel-form/input/TestFormInputRadio';
import TestFormInputText from '@test/testregel-form/input/TestFormInputText';
import { TestFormStep } from '@test/testregel-form/types';
import { SelectionOutcome, TestingStep } from '@test/types';

import TestResultCard from './TestResultCard';

interface FormStepProps {
  testingStep?: TestingStep;
  formStep: TestFormStep;
  onAction: (stepKey: string, selectionOutcome: SelectionOutcome) => void;
}

const TestFormStepWrapper = ({
  testingStep,
  formStep,
  onAction,
}: FormStepProps) => {
  if (formStep.key === 'avslutt') {
    return (
      <TestResultCard
        resultTitle={
          formStep.fasit?.toLowerCase() === 'ja' ? 'Samsvar' : 'Ikkje samsvar'
        }
        resultDescription={formStep.utfall || 'Inget resultat'}
      />
    );
  } else if (formStep.key === 'ikkjeForekomst') {
    return (
      <TestResultCard
        resultTitle="Ikkje forekomst"
        resultDescription={formStep.utfall || 'Inget resultat'}
      />
    );
  } else if (!testingStep) {
    return <ErrorMessage>Fann ikkje steg</ErrorMessage>;
  }

  const inputType = testingStep.input.inputType;

  switch (inputType) {
    case 'tekst':
    case 'multiline':
      return (
        <TestFormInputText
          testingStep={testingStep}
          formStep={formStep}
          multiline={inputType === 'multiline'}
        />
      );
    case 'instruksjon':
      return <TestFormDescription testingStep={testingStep} />;
    case 'radio':
    case 'jaNei':
      return (
        <TestFormInputRadio
          testingStep={testingStep}
          formStep={formStep}
          onAction={onAction}
        />
      );
  }
};
export default TestFormStepWrapper;
