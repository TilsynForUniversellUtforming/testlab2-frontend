import './status-chart.scss';

import { Heading } from '@digdir/design-system-react';

export type ChartStatus = {
  statusCount: number;
  statusText: string;
};

interface ChartProps {
  pendingStatus: ChartStatus;
  runningStatus: ChartStatus;
  finishedStatus: ChartStatus;
  errorStatus: ChartStatus;
  show: boolean;
}

const StatusChart = ({
  pendingStatus,
  runningStatus,
  finishedStatus,
  errorStatus,
  show,
}: ChartProps) => {
  if (!show) {
    return null;
  }

  const total =
    pendingStatus.statusCount +
    runningStatus.statusCount +
    finishedStatus.statusCount +
    errorStatus.statusCount;

  const percentFinished = (x: number) => (x / total) * 100;

  const ProgressElement = (props: {
    chartStatus: ChartStatus;
    variant: 'ikke-startet' | 'underveis' | 'ferdig' | 'feilet';
  }) => (
    <div className="status-chart__progress-element">
      <Heading size="small">
        {props.chartStatus.statusText} ({props.chartStatus.statusCount} av{' '}
        {total})
      </Heading>
      <div
        className={'status-chart__bar status-chart__bar--' + props.variant}
        style={{ width: `${percentFinished(props.chartStatus.statusCount)}%` }}
      ></div>
    </div>
  );

  return (
    <div className="status-chart">
      <Heading size="large" className="status-chart__heading">
        Status
      </Heading>
      {pendingStatus.statusCount > 0 && (
        <ProgressElement chartStatus={pendingStatus} variant="ikke-startet" />
      )}
      <ProgressElement chartStatus={runningStatus} variant="underveis" />
      <ProgressElement chartStatus={finishedStatus} variant="ferdig" />
      {errorStatus.statusCount > 0 && (
        <ProgressElement chartStatus={errorStatus} variant="feilet" />
      )}
    </div>
  );
};

export default StatusChart;
