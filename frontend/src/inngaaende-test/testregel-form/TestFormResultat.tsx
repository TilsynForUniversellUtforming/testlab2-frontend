import TestlabDivider from '@common/divider/TestlabDivider';
import ImageUpload from '@common/image-edit/ImageUpload';
import { TestlabSeverity } from '@common/types';
import {
  Heading, Label,
  Paragraph,
  Tag,
  Textarea,
} from '@digdir/designsystemet-react';
import { TestregelResultat } from '@test/util/testregelParser';
import DOMPurify from 'dompurify';
import { useState } from 'react';
import styles from '@test/testregel-form/test-form.module.scss';

interface Props {
  resultatId: number;
  resultat: TestregelResultat;
  onChangeKommentar: (
    resultatId: number,
    kommentar: string | undefined
  ) => void;
  kommentar: string;
  isElementSide: boolean;
  isDemoApp?: boolean;
}


const TestFormResultat = ({
  resultat,
  onChangeKommentar,
  kommentar,
  resultatId,
  isElementSide,
  isDemoApp
}: Props) => {

  const { severity, title } = getResultSeverity(
    resultat.type,
    resultat.type === 'avslutt' ? resultat.fasit : undefined
  );

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
    <div className={styles.testFormResultCard}>
      <TestlabDivider size="sm" />
      <div className={styles.testFormResultHeading}>
        <Heading data-size="md" level={4}>
          Resultater
        </Heading>
        <Paragraph data-size="sm">
          Basert på svara dine er det følgjande utfall på dette suksesskriteriet
        </Paragraph>
      </div>
      <div className={styles.testFormResultCardResult}>
        <Tag data-color={severity} data-size="lg">
          {title}
        </Tag>
        <Paragraph dangerouslySetInnerHTML={cleanHTMLUtfall}></Paragraph>
      </div>
      <Label htmlFor={'kommentar'}>
        {isElementSide
          ? 'Kommenter resultat'
          : 'Frivillig kommentar til resultatet'}
      </Label>
      <Textarea
        id={kommentar}
        value={nyKommentar}
        onBlur={onBlur}
        onChange={(e) => setNyKommentar(e.target.value)}
      />
      <ImageUpload resultatId={resultatId} isDemo={isDemoApp} />
    </div>
  );
};

function getResultSeverity(
  type: TestregelResultat['type'],
  fasit?: Extract<TestregelResultat, { type: 'avslutt' }>['fasit']
): {
  severity: TestlabSeverity;
  title: string;
} {
  if (type === 'ikkjeForekomst') {
    return { severity: 'info', title: 'Ikkje forekomst' };
  }

  if (type === 'avslutt') {
    switch (fasit) {
      case 'Ja':
        return { severity: 'success', title: 'Samsvar' };
      case 'Nei':
        return { severity: 'danger', title: 'Brot' };
      case 'Ikkje testbart':
        return { severity: 'info', title: 'Ikkje testbart' };
      default:
        return { severity: 'info', title: 'Ukjent resultat' };
    }
  }

  return { severity: 'info', title: 'Ukjent resultat' };
}

export default TestFormResultat;
