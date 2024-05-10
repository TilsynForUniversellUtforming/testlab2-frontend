import { Heading, Ingress, Paragraph } from '@digdir/designsystemet-react';
import { Steg } from '@test/util/testregel-interface/Steg';
import DOMPurify from 'dompurify';

interface Props {
  steg: Steg;
}

const TestFormDescription = ({ steg }: Props) => {
  const { spm, ht } = steg;
  const spmHTML = { __html: DOMPurify.sanitize(spm) };
  const htHTML = { __html: DOMPurify.sanitize(ht) };
  return (
    <div className="test-form-instruction">
      <Heading size="xsmall" level={4} spacing>
        Instruksjon:
      </Heading>
      <Ingress dangerouslySetInnerHTML={spmHTML}></Ingress>
      <Paragraph size="small" dangerouslySetInnerHTML={htHTML}></Paragraph>
    </div>
  );
};

export default TestFormDescription;
