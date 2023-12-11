import TestlabDivider from '@common/divider/TestlabDivider';
import FileUpload from '@common/file-upload/FileUpload';
import { TestlabSeverity } from '@common/types';
import { Heading, Paragraph, Tag, Textarea } from '@digdir/design-system-react';
import { useState } from 'react';

const TestResultCard = ({
  resultTitle,
  resultDescription,
  resultSeverity,
}: {
  resultTitle: string;
  resultDescription: string;
  resultSeverity: TestlabSeverity;
}) => {
  const [resultComment, setResultComment] = useState<string>('');

  return (
    <div className="test-form__result-card">
      <TestlabDivider size="xsmall" />
      <div className="test-form__result-heading">
        <Heading size="medium" level={4}>
          Resultater
        </Heading>
        <Paragraph size="small">
          Basert på svara dine er det følgjande utfall på dette suksesskriteriet
        </Paragraph>
      </div>
      <div className="test-form__result-card-result">
        <Tag color={resultSeverity} size="large">
          {resultTitle}
        </Tag>
        <Paragraph>{resultDescription}</Paragraph>
      </div>
      <Textarea
        label="Frivillig kommentar til resultatet"
        value={String(resultComment)}
        onChange={(e) => setResultComment(e.target.value)}
      />
      <FileUpload />
    </div>
  );
};

export default TestResultCard;
