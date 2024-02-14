import { TestlabSeverity } from '@common/types';
import { parseHtmlEntities } from '@common/util/stringutils';
import TestResultCard from '@test/testregel-form/TestResultCard';
import { TestregelResultat } from '@test/util/testregelParser';

interface Props {
  resultat: TestregelResultat;
}

const TestFormResultat = ({ resultat }: Props) => {
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
  return (
    <TestResultCard
      resultTitle={title}
      resultDescription={parseHtmlEntities(resultat.utfall) || 'Inget resultat'}
      resultSeverity={severity}
    />
  );
};

export default TestFormResultat;
