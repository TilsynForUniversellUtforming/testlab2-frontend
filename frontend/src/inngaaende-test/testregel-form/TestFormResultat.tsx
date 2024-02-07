import TestResultCard from '@test/testregel-form/TestResultCard';
import {
  parseHtmlEntities,
  TestregelResultat,
  toElementResultat,
} from '@test/util/testregelParser';

interface Props {
  resultat: TestregelResultat;
}

const TestFormResultat = ({ resultat }: Props) => {
  if (resultat?.type === 'avslutt') {
    const elementResultat = toElementResultat(resultat);
    const isSamsvar = elementResultat === 'samsvar';
    return (
      <TestResultCard
        resultSeverity={isSamsvar ? 'success' : 'danger'}
        resultTitle={isSamsvar ? 'Samsvar' : 'Ikkje samsvar'}
        resultDescription={
          parseHtmlEntities(resultat.utfall) || 'Inget resultat'
        }
      />
    );
  } else if (resultat?.type === 'ikkjeForekomst') {
    return (
      <TestResultCard
        resultSeverity={'info'}
        resultTitle="Ikkje forekomst"
        resultDescription={
          parseHtmlEntities(resultat.utfall) || 'Inget resultat'
        }
      />
    );
  }
};

export default TestFormResultat;
