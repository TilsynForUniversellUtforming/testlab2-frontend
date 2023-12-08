import { Heading, Ingress, Paragraph } from '@digdir/design-system-react';
import { TestingStep } from '@test/types';

interface Props {
  testingStep: TestingStep;
}

const TestFormDescription = ({ testingStep }: Props) => {
  return (
    <>
      <Heading size="small" level={4} spacing>
        Instruksjon:
      </Heading>
      <Ingress>{testingStep.heading}</Ingress>
      <Paragraph size="small">{testingStep.description}</Paragraph>
    </>
  );
};

export default TestFormDescription;
