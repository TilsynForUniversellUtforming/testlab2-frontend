import { Textarea, Textfield } from '@digdir/design-system-react';
import { TestFormStep } from '@test/testregel-form/types';
import { TestStep } from '@test/types';
import { useState } from 'react';

interface Props {
  testingStep: TestStep;
  formStep: TestFormStep;
  multiline: boolean;
}

const TestFormInputText = ({ testingStep, formStep, multiline }: Props) => {
  const {
    step: { heading },
    answer,
  } = testingStep;
  const [value, setValue] = useState<string>(answer?.svar || '');

  if (multiline) {
    return (
      <Textarea
        label={heading}
        name={formStep.key}
        value={String(value)}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  }

  return (
    <Textfield
      label={heading}
      name={formStep.key}
      type="text"
      value={String(value)}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default TestFormInputText;
