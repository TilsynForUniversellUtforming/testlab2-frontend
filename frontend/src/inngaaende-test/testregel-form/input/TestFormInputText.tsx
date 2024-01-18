import DebouncedInput from '@common/debounced-input/DebouncedInput';
import { TestFormStep } from '@test/testregel-form/types';
import { SelectionOutcome, TestStep } from '@test/types';
import { useEffect, useState } from 'react';

interface Props {
  testingStep: TestStep;
  formStep: TestFormStep;
  multiline: boolean;
  updateText: (
    stepKey: string,
    answer: string,
    selectionOutcome?: SelectionOutcome
  ) => void;
}

const TestFormInputText = ({
  testingStep,
  formStep,
  multiline,
  updateText,
}: Props) => {
  const {
    step: { heading },
    answer,
  } = testingStep;
  const [value, setValue] = useState<string>(answer?.svar || '');
  const [prevValue, setPrevValue] = useState(value);

  useEffect(() => {
    if (prevValue !== '' || value) {
      setPrevValue(value);
      updateText(formStep.key, value);
    }
  }, [value]);

  return (
    <DebouncedInput
      label={heading}
      name={formStep.key}
      type="text"
      value={String(value)}
      onChange={setValue}
      textArea={multiline}
    />
  );
};

export default TestFormInputText;
