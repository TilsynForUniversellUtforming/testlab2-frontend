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
  const percentSideutval = progressionForTestgrunnlagSideutval(
    testgrunnlag,
    resultatliste,
    loeysingId
  );
  const percentInnhaldstype = progressionForTestgrunnlagInnhaldstype(
    testgrunnlag,
    resultatliste,
    loeysingId
  );

  const testStatisticsLabel = `${percentSideutval}% Sideutval | ${percentInnhaldstype}% Innhaldstype`;

  return (
    <Tag data-size="sm" className={classes.statistikk}>
      {testStatisticsLabel}
    </Tag>
  );
};

export default TestStatistics;
