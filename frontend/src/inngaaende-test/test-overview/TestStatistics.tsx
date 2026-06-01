import { Tag } from '@digdir/designsystemet-react';
import classes from '@test/test-overview/test-overview.module.css';

interface Props {
  percentSideutval: number;
  percentInnhaldstype: number;
}

const TestStatistics = ({ percentSideutval, percentInnhaldstype }: Props) => {
  const testStatisticsLabel = `${percentSideutval}% Sideutval | ${percentInnhaldstype}% Innhaldstype`;

  return (
    <Tag data-size="sm" className={classes.statistikk}>
      {testStatisticsLabel}
    </Tag>
  );
};

export default TestStatistics;
