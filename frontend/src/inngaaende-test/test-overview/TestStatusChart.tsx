import LoadingBar from '@common/loading-bar/LoadingBar';
import { ResultatManuellKontroll } from '@test/api/types';
import { Testgrunnlag } from '@test/types';

import classes from './test-overview.module.css';

interface Props {
  testgrunnlag: Testgrunnlag;
  resultater: ResultatManuellKontroll[];
  loeysingId: number;
}

const TestStatusChart = ({ testgrunnlag, resultater, loeysingId }: Props) => {
  const loeysingSideutval = testgrunnlag.sideutval.filter(
    (su) => su.loeysingId === loeysingId
  );
  const loeysingResultat = resultater.filter(
    (r) => r.loeysingId === loeysingId && r.testgrunnlagId === testgrunnlag.id
  );

  const total = loeysingSideutval.length * testgrunnlag.testreglar.length;
  const finished = new Set(
    loeysingResultat
      .filter((r) => r.status === 'Ferdig')
      .map((r) => `${r.sideutvalId}_${r.testregelId}`)
  ).size;
  const testing = new Set(
    loeysingResultat
      .filter((r) => r.status !== 'Ferdig')
      .map((r) => `${r.sideutvalId}_${r.testregelId}`)
  ).size;
  const pending = total - (finished + testing);

  const percentage = (count: number) => Math.round((count / total) * 100);

  const statusText = (state: string, count: number) =>
    `${state} (${count} av ${total})`;

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
