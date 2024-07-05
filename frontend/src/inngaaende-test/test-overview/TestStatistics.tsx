import { Tag } from '@digdir/designsystemet-react';
import { ResultatManuellKontroll } from '@test/api/types';
import classes from '@test/test-overview/test-overview.module.css';
import { Testgrunnlag } from '@test/types';
import {
  progressionForTestgrunnlagInnhaldstype,
  progressionForTestgrunnlagSideutval,
} from '@test/util/testregelUtils';

interface Props {
  resultatliste: ResultatManuellKontroll[];
  loeysingId: number;
  testgrunnlag: Testgrunnlag;
}

const TestStatistics = ({ resultatliste, loeysingId, testgrunnlag }: Props) => {
  const resultat = resultatliste.filter(
    (r) => r.loeysingId === loeysingId && r.testgrunnlagId === testgrunnlag.id
  );
  const percentSideutval = progressionForTestgrunnlagSideutval(
    testgrunnlag,
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
