import { Heading, Paragraph } from '@digdir/designsystemet-react';
import { Steg } from '@test/util/testregel-interface/Steg';
import DOMPurify from 'dompurify';
import styles from '@test/testregel-form/test-form.module.scss';

interface Props {
  steg: Steg;
}

const TestFormDescription = ({ steg }: Props) => {
  const { spm, ht } = steg;
  const spmHTML = { __html: DOMPurify.sanitize(spm) };
  const htHTML = { __html: DOMPurify.sanitize(ht) };
  return (
    <div className={styles.testFormInstruction}>
      <Heading data-size="xs" level={4} >
        Instruksjon:
      </Heading>
      <Paragraph dangerouslySetInnerHTML={spmHTML} variant={"long"}></Paragraph>
      <Paragraph data-size="sm" dangerouslySetInnerHTML={htHTML}></Paragraph>
    </div>
  );
};

export default TestFormDescription;
