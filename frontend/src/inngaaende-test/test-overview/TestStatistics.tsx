import { Tag } from '@digdir/designsystemet-react';
import { ResultatManuellKontroll } from '@test/api/types';
import classes from '@test/test-overview/test-overview.module.css';
import { ContextKontroll, Testgrunnlag } from '@test/types';
import {
  progressionForTestgrunnlagInnhaldstype,
  progressionForTestgrunnlagSideutval,
} from '@test/util/testregelUtilsKontroll';

interface Props {
  kontroll: ContextKontroll;
  resultatliste: ResultatManuellKontroll[];
  loeysingId: number;
  testgrunnlag: Testgrunnlag;
}

const TestStatistics = ({
  kontroll,
  resultatliste,
  loeysingId,
  testgrunnlag,
}: Props) => {
  const resultat = resultatliste.filter(
    (r) => r.loeysingId === loeysingId && r.testgrunnlagId === testgrunnlag.id
  );
  const percentSideutval = progressionForTestgrunnlagSideutval(
    kontroll,
    resultat,
    loeysingId
  );
  const percentInnhaldstype = progressionForTestgrunnlagInnhaldstype(
    testgrunnlag,
    resultat,
    loeysingId
  );

  const testStatisticsLabel = `${percentSideutval}% Sideutval | ${percentInnhaldstype}% Innhaldstype`;

  return (
    <Tag size="small" className={classes.statistikk}>
      {testStatisticsLabel}
    </Tag>
  );
};

export default TestStatistics;
