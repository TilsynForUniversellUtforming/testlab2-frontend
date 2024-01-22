import { Heading, Ingress, Paragraph } from '@digdir/design-system-react';
import { TestStep } from '@test/types';

interface Props {
  testingStep: TestStep;
}

const TestFormDescription = ({ testingStep }: Props) => {
  const {
    step: { heading, description },
  } = testingStep;
  return (
    <>
      <Heading size="small" level={4} spacing>
        Instruksjon:
      </Heading>
      <Ingress>{heading}</Ingress>
      <Paragraph size="small">{description}</Paragraph>
    </>
  );
};

export default TestFormDescription;
