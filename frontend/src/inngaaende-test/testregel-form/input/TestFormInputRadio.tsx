import { Radio } from '@digdir/design-system-react';
import { TestFormStep } from '@test/testregel-form/types';
import { SelectionOutcome, TestingStep } from '@test/types';
import { useEffect, useState } from 'react';

interface Props {
  testingStep: TestingStep;
  formStep: TestFormStep;
  onAction: (stepKey: string, selectionOutcome: SelectionOutcome) => void;
}

const TestFormInputRadio = ({ testingStep, formStep, onAction }: Props) => {
  const [value, setValue] = useState<string>('ingen');

  useEffect(() => {
    const inputSelectionOutcome = testingStep.input.inputSelectionOutcome.find(
      (iso) => iso.label === value
    );
    if (inputSelectionOutcome) {
      onAction(formStep.key, inputSelectionOutcome);
    }
  }, [value]);

  useEffect(() => {
    setValue('ingen');
  }, [formStep]);

  return (
    <Radio.Group
      legend={testingStep.heading}
      value={value}
      onChange={setValue}
      name={formStep.key}
    >
      {testingStep.input.inputSelectionOutcome.map((u) => (
        <Radio value={u.label || ''} key={u.label}>
          {u.label}
        </Radio>
      ))}
    </Radio.Group>
  );
};

export default TestFormInputRadio;
