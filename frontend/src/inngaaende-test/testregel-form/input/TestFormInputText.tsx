import { Textarea, Textfield } from '@digdir/design-system-react';
import { TestFormStep } from '@test/testregel-form/types';
import { TestingStep } from '@test/types';
import { useState } from 'react';

interface Props {
  testingStep: TestingStep;
  formStep: TestFormStep;
  multiline: boolean;
}

const TestFormInputText = ({ testingStep, formStep, multiline }: Props) => {
  const [value, setValue] = useState<string>('');

  if (multiline) {
    return (
      <Textarea
        label={testingStep.heading}
        name={formStep.key}
        value={String(value)}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  }

  return (
    <Textfield
      label={testingStep.heading}
      name={formStep.key}
      type="text"
      value={String(value)}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default TestFormInputText;
