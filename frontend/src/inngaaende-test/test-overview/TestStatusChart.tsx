import LoadingBar from '@common/loading-bar/LoadingBar';
import { ResultatManuellKontroll } from '@test/api/types';
import { Testgrunnlag } from '@test/types';
import { getTestStatusCounts } from './util/testOverviewUtils';
import classes from './test-overview.module.css';

interface Props {
  testgrunnlag: Testgrunnlag;
  resultater: ResultatManuellKontroll[];
  loeysingId: number;
}

const TestStatusChart = ({ testgrunnlag, resultater, loeysingId }: Props) => {
  const { total, finished, testing, pending } = getTestStatusCounts(
    testgrunnlag,
    resultater,
    loeysingId
  );

  const percentage = (count: number) => Math.round((count / total) * 100);
  const statusText = (state: string, count: number) => `${state} (${count} av ${total})`;

  return (
    <div className={classes.statusContainer}>
      <div className={classes.status}>
        <LoadingBar
          percentage={percentage(pending)}
          customText={statusText('Ikkje starta', pending)}
          dynamicSeverity={false}
          severity="neutral"
          ariaLabel="Tester med status ikkje starta"
        />
        <LoadingBar
          percentage={percentage(testing)}
          customText={statusText('Tester', testing)}
          dynamicSeverity={false}
          severity="second"
          ariaLabel="Tester med status tester"
        />
        <LoadingBar
          percentage={percentage(finished)}
          customText={statusText('Ferdig', finished)}
          dynamicSeverity={false}
          severity="success"
          ariaLabel="Tester med status ferdig"
        />
      </div>
    </div>
  );
};

export default TestStatusChart;
