import DebouncedInput from '@common/debounced-input/DebouncedInput';
import { Svar } from '@test/api/types';
import { TestFormStep } from '@test/testregel-form/types';
import { TestStep } from '@test/types';
import { useCallback, useState } from 'react';

interface Props {
  testingStep: TestStep;
  formStep: TestFormStep;
  multiline: boolean;
  onAnswer: (answer: Svar) => void;
}

const TestFormInputText = ({
  testingStep,
  formStep,
  multiline,
  onAnswer,
}: Props) => {
  const {
    step: { heading, description },
    answer,
  } = testingStep;
  const [value, setValue] = useState(answer?.svar);

  const handleValueChange = useCallback(
    (newValue?: string) => {
      setValue(newValue);
      if (typeof newValue === 'string' && newValue !== answer?.svar) {
        onAnswer({ steg: formStep.key, svar: newValue });
      }
    },
    [answer?.svar, formStep.key]
  );

  return (
    <DebouncedInput
      label={heading}
      description={description}
      name={formStep.key}
      type="text"
      value={value}
      onChange={handleValueChange}
      textArea={multiline}
    />
  );
};

export default TestFormInputText;
