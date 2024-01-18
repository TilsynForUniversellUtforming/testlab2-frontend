import { Radio } from '@digdir/design-system-react';
import { TestFormStep } from '@test/testregel-form/types';
import { SelectionOutcome, TestStep } from '@test/types';
import { useEffect, useState } from 'react';

interface Props {
  testingStep: TestStep;
  formStep: TestFormStep;
  onRadioAction: (
    stepKey: string,
    answer: string,
    selectionOutcome: SelectionOutcome
  ) => void;
}

const TestFormInputRadio = ({
  testingStep,
  formStep,
  onRadioAction,
}: Props) => {
  const { step, answer } = testingStep;
  const [value, setValue] = useState<string>(answer?.svar || 'ingen');

  useEffect(() => {
    const inputSelectionOutcome = step.input.inputSelectionOutcome.find(
      (iso) => iso.label === value
    );
    if (inputSelectionOutcome) {
      onRadioAction(formStep.key, value, inputSelectionOutcome);
    }
  }, [value]);

  useEffect(() => {
    setValue('ingen');
  }, [formStep]);

  return (
    <Radio.Group
      legend={step.heading}
      value={value}
      onChange={setValue}
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
