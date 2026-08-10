import { Testregel } from '@testreglar/api/types';
import { ResultatManuellKontroll } from '@test/api/types';
import { TestResultUpdate } from '@test/types';
import { Heading } from '@digdir/designsystemet-react';
import { TestFormAccordion } from '@test/testregel-form/TestFormAccordion';
import DOMPurify from 'dompurify';

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
                    resultater,
                    showHelpText,
                    onResultat,
                    slettTestelement,
                    isLoading,
                    isDemoApp,
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
    <div className="test-form">
      <Heading dat-size="md" level={3}>
        {testregel.namn}
      </Heading>
      {testregel.kravTilSamsvar && showHelpText && (
        <div
          className="test-form-description"
          dangerouslySetInnerHTML={kravTilSamsvar}
        ></div>
      )}
      <div
        className="test-form-description"
        dangerouslySetInnerHTML={instruksjon}
      ></div>
    </div>
  );


}

export default TestFormForenkla;


