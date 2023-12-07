import TestlabDivider from '@common/divider/TestlabDivider';
import { Heading, Paragraph, Textarea } from '@digdir/design-system-react';
import { useState } from 'react';

const TestResultCard = ({
  resultTitle,
  resultDescription,
}: {
  resultTitle: string;
  resultDescription: string;
}) => {
  const [resultComment, setResultComment] = useState<string>('');

  return (
    <div className="test-form__result-card">
      <TestlabDivider size="xsmall" />
      <div>
        <Heading size="small" level={4}>
          Resultater
        </Heading>
        <Paragraph size="small">
          Basert på svara dine er det følgjande utfall på dette
          suksesskriteriet.
        </Paragraph>
      </div>
      <div>
        <Paragraph>{resultTitle}</Paragraph>
        <Paragraph>{resultDescription}</Paragraph>
      </div>
      <Textarea
        label="Frivillig kommentar til resultatet"
        value={String(resultComment)}
        onChange={(e) => setResultComment(e.target.value)}
      />
      <div>IMAGE UPLOAD</div>
    </div>
  );
};

export default TestResultCard;
