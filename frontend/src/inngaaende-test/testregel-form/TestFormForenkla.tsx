import { Testregel } from '@testreglar/api/types';
import { ResultatManuellKontroll } from '@test/api/types';
import { TestResultUpdate } from '@test/types';
import { Heading } from '@digdir/designsystemet-react';
import DOMPurify from 'dompurify';
import styles from '@test/testregel-form/test-form.module.scss';

interface Props {
  testregel: Testregel;
  resultater: ResultatManuellKontroll[];
  showHelpText: boolean;
  onResultat: (testResultUpdate: TestResultUpdate) => void;
  slettTestelement: (resultatId: number) => void;
  isLoading: boolean;
  isDemoApp?: boolean;
}

const TestFormForenkla = ({
                    testregel,
                    showHelpText,
                  }: Props) => {

  if (testregel.definition === undefined) {
    throw new Error('definition er tomt');
  }
  const cleanHTML = DOMPurify.sanitize(testregel.kravTilSamsvar ?? '', {
    USE_PROFILES: { html: true },
  });
  const kravTilSamsvar = { __html: cleanHTML };

  const cleanInstruksjon = DOMPurify.sanitize(
    testregel.definition.description ?? '',
    {
      USE_PROFILES: { html: true },
    }
  );

  const instruksjon = { __html: cleanInstruksjon };

  return (
    <div className={styles.testForm}>
      <Heading dat-size="md" level={3}>
        {testregel.namn}
      </Heading>
      {testregel.kravTilSamsvar && showHelpText && (
        <div
          className={styles.testFormDescription}
          dangerouslySetInnerHTML={kravTilSamsvar}
        ></div>
      )}
      <div
        className={styles.testFormDescription}
        dangerouslySetInnerHTML={instruksjon}
      ></div>
    </div>
  );


}

export default TestFormForenkla;


