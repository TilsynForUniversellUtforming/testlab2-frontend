import TestlabDivider from '@common/divider/TestlabDivider';
import ImageUpload from '@common/image-edit/ImageUpload';
import { TestlabSeverity } from '@common/types';
import { Heading, Paragraph, Tag, Textarea } from '@digdir/design-system-react';
import DOMPurify from 'dompurify';
import { useState } from 'react';

const TestResultCard = ({
  resultTitle,
  resultDescription,
  resultSeverity,
  showImageUpload,
}: {
  resultTitle: string;
  resultDescription: string;
  resultSeverity: TestlabSeverity;
  showImageUpload: boolean;
}) => {
  const [resultComment, setResultComment] = useState<string>('');
  const cleanHTML = { __html: DOMPurify.sanitize(resultDescription) };

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
        <Paragraph dangerouslySetInnerHTML={cleanHTML}></Paragraph>
      </div>
      <Textarea
        label="Frivillig kommentar til resultatet"
        value={String(resultComment)}
        onChange={(e) => setResultComment(e.target.value)}
      />
      {showImageUpload && <ImageUpload />}
    </div>
  );
};

export default TestResultCard;
