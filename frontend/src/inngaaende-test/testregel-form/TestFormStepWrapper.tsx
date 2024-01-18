import { ErrorMessage } from '@digdir/design-system-react';
import TestFormDescription from '@test/testregel-form/input/TestFormDescription';
import TestFormInputRadio from '@test/testregel-form/input/TestFormInputRadio';
import TestFormInputText from '@test/testregel-form/input/TestFormInputText';
import { TestFormStep } from '@test/testregel-form/types';
import { SelectionOutcome, TestStep } from '@test/types';

import TestResultCard from './TestResultCard';

interface FormStepProps {
  testingStep?: TestStep;
  formStep: TestFormStep;
  onRadioAction: (
    stepKey: string,
    answer: string,
    selectionOutcome: SelectionOutcome
  ) => void;
}

const TestFormStepWrapper = ({
  testingStep,
  formStep,
  onRadioAction,
}: FormStepProps) => {
  if (formStep.key === 'avslutt') {
    const isSamsvar = formStep.fasit?.toLowerCase() === 'ja';
    return (
      <TestResultCard
        resultSeverity={isSamsvar ? 'success' : 'danger'}
        resultTitle={isSamsvar ? 'Samsvar' : 'Ikkje samsvar'}
        resultDescription={formStep.utfall || 'Inget resultat'}
      />
    );
  } else if (formStep.key === 'ikkjeForekomst') {
    return (
      <TestResultCard
        resultSeverity={'info'}
        resultTitle="Ikkje forekomst"
        resultDescription={formStep.utfall || 'Inget resultat'}
      />
    );
  } else if (!testingStep) {
    return <ErrorMessage>Fann ikkje steg</ErrorMessage>;
  }

  const inputType = testingStep.step.input.inputType;

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
          onRadioAction={onRadioAction}
        />
      );
  }
};
export default TestFormStepWrapper;
