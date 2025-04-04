import TestlabDivider from '@common/divider/TestlabDivider';
import ImageUpload from '@common/image-edit/ImageUpload';
import { TestlabSeverity } from '@common/types';
import {
  Heading,
  Paragraph,
  Tag,
  Textarea,
} from '@digdir/designsystemet-react';
import { TestregelResultat } from '@test/util/testregelParser';
import DOMPurify from 'dompurify';
import { useState } from 'react';

interface Props {
  resultatId: number;
  resultat: TestregelResultat;
  onChangeKommentar: (
    resultatId: number,
    kommentar: string | undefined
  ) => void;
  kommentar: string;
  isElementSide: boolean;
}

const TestFormResultat = ({
  resultat,
  onChangeKommentar,
  kommentar,
  resultatId,
  isElementSide,
}: Props) => {
  let severity: TestlabSeverity;
  let title: string;

  switch (resultat?.type) {
    case 'avslutt':
      switch (resultat.fasit) {
        case 'Ja':
          severity = 'success';
          title = 'Samsvar';
          break;
        case 'Nei':
          severity = 'danger';
          title = 'Brot';
          break;
        case 'Ikkje testbart':
          severity = 'info';
          title = 'Ikkje testbart';
      }
      break;
    case 'ikkjeForekomst':
      severity = 'info';
      title = 'Ikkje forekomst';
      break;
  }

  const cleanHTMLUtfall = {
    __html: DOMPurify.sanitize(resultat.utfall || 'Inget resultat'),
  };

  const [nyKommentar, setNyKommentar] = useState<string | undefined>(kommentar);

  const onBlur = () => {
    if (nyKommentar !== kommentar) {
      onChangeKommentar(resultatId, nyKommentar);
    }
  };

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
        <Tag color={severity} size="large">
          {title}
        </Tag>
        <Paragraph dangerouslySetInnerHTML={cleanHTMLUtfall}></Paragraph>
      </div>
      <Textarea
        label={
          isElementSide
            ? 'Kommenter resultat'
            : 'Frivillig kommentar til resultatet'
        }
        value={nyKommentar}
        onBlur={onBlur}
        onChange={(e) => setNyKommentar(e.target.value)}
      />
      <ImageUpload resultatId={resultatId} />
    </div>
  );
};

export default TestFormResultat;
