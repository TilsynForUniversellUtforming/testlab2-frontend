import { Radio } from '@digdir/design-system-react';
import { Svar } from '@test/api/types';
import { TestFormStep } from '@test/testregel-form/types';
import { SelectionOutcome, TestStep } from '@test/types';
import { useCallback, useEffect, useState } from 'react';

interface Props {
  testingStep: TestStep;
  formStep: TestFormStep;
  onAnswer: (answer: Svar, selectionOutcome?: SelectionOutcome) => void;
}

const TestFormInputRadio = ({ testingStep, formStep, onAnswer }: Props) => {
  const { step, answer } = testingStep;
  const noAnswer = 'no_answer_radio';
  const [value, setValue] = useState(noAnswer);

  const handleValueChange = useCallback(
    (newValue: string) => {
      setValue(newValue);
      if (newValue && newValue !== answer?.svar && newValue !== noAnswer) {
        const inputSelectionOutcome = step.input.inputSelectionOutcome.find(
          (iso) => iso.label === newValue
        );
        onAnswer({ steg: formStep.key, svar: newValue }, inputSelectionOutcome);
      }
    },
    [answer?.svar, formStep.key]
  );

  useEffect(() => {
    if (answer?.svar && answer?.svar !== value) {
      setValue(answer.svar);
    } else if (!answer?.svar) {
      setValue(noAnswer);
    }
  }, [testingStep]);

  return (
    <Radio.Group
      legend={step.heading}
      value={value}
      onChange={handleValueChange}
      name={formStep.key}
    >
      {step.input.inputSelectionOutcome.map((u) => (
        <Radio value={u.label || ''} key={u.label}>
          {u.label}
        </Radio>
      ))}
    </Radio.Group>
  );
};

export default TestFormInputRadio;
