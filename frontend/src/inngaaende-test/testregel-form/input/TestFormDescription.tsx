import { Heading, Ingress, Paragraph } from '@digdir/design-system-react';
import { Steg } from '@test/util/testregel-interface/Steg';

interface Props {
  steg: Steg;
}

const TestFormDescription = ({ steg }: Props) => {
  const { spm, ht } = steg;
  return (
    <>
      <Heading size="small" level={4} spacing>
        Instruksjon:
      </Heading>
      <Ingress>{spm}</Ingress>
      <Paragraph size="small">{ht}</Paragraph>
    </>
  );
};

export default TestFormDescription;
