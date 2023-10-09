import './status-chart.scss';

import LoadingBar from '@common/loading-bar/LoadingBar';
import { TestlabSeverity } from '@common/types';
import { Heading, Spinner } from '@digdir/design-system-react';

export type ChartStatus = {
  statusCount: number;
  statusText: string;
  severity: TestlabSeverity;
};

interface ChartProps {
  pendingStatus: ChartStatus;
  runningStatus: ChartStatus;
  finishedStatus: ChartStatus;
  errorStatus: ChartStatus;
  show: boolean;
  loadingStateStatus?: string;
}

interface ProgressElementProps {
  chartStatus: ChartStatus;
  total: number;
}

const ProgressElement = ({ chartStatus, total }: ProgressElementProps) => {
  const percentage = Math.round((chartStatus.statusCount / total) * 100);
  const statusText = `${chartStatus.statusText} (${chartStatus.statusCount} av ${total})`;
  return (
    <div className="status-chart__progress-element">
      <LoadingBar
        percentage={percentage}
        size={'large'}
        customText={statusText}
        dynamicSeverity={false}
        textPlacement={'left'}
        severity={chartStatus.severity}
      />
    </div>
  );
};

const StatusChart = ({
  pendingStatus,
  runningStatus,
  finishedStatus,
  errorStatus,
  show,
  loadingStateStatus,
}: ChartProps) => {
  if (!show) {
    return null;
  }

  const total =
    pendingStatus.statusCount +
    runningStatus.statusCount +
    finishedStatus.statusCount +
    errorStatus.statusCount;

  return (
    <div className="status-chart">
      <Heading size="medium" className="status-chart__heading">
        Status
      </Heading>
      {[pendingStatus, runningStatus, finishedStatus, errorStatus].map(
        (status, idx) => (
          <ProgressElement
            chartStatus={status}
            total={total}
            key={`${status.severity}_${idx}`}
          />
        )
      )}
      {loadingStateStatus && (
        <>
          {`${loadingStateStatus} `}
          <Spinner title={loadingStateStatus} size="small" />
        </>
      )}
    </div>
  );
};

export default StatusChart;
