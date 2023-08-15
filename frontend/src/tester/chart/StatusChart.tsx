import './status-chart.scss';

import Highcharts from 'highcharts';
import AccessibilityModule from 'highcharts/modules/accessibility';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';

export type ChartStatus = {
  statusCount: number;
  statusText: string;
};

interface ChartProps {
  pendingStatus: ChartStatus;
  runningStatus: ChartStatus;
  finishedStatus: ChartStatus;
  errorStatus: ChartStatus;
}

const StatusChart = ({
  pendingStatus,
  runningStatus,
  finishedStatus,
  errorStatus,
}: ChartProps) => {
  AccessibilityModule(Highcharts);

  const options: Highcharts.Options = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Status',
      align: 'left',
    },
    xAxis: {
      categories: ['Status'],
      crosshair: true,
      accessibility: {
        description: 'Status',
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Løysingar ',
      },
      tickInterval: 1,
    },
    tooltip: {
      valueSuffix: ' løysingar',
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [
      {
        type: 'column',
        name: pendingStatus.statusText,
        color: '#68707c',
        data: [{ y: pendingStatus.statusCount }],
      },
      {
        type: 'column',
        name: runningStatus.statusText,
        color: '#0062ba',
        data: [{ y: runningStatus.statusCount }],
      },
      {
        type: 'column',
        name: finishedStatus.statusText,
        color: '#118849',
        data: [{ y: finishedStatus.statusCount }],
      },
      {
        type: 'column',
        name: errorStatus.statusText,
        color: '#e02e49',
        data: [{ y: errorStatus.statusCount }],
      },
    ],
    accessibility: {
      enabled: true,
      description: `Eit kolonnediagram som representerer statusen til målingar med kategoriar for ${runningStatus.statusText}, ${finishedStatus.statusText} og ${errorStatus.statusText}.`,
    },
  };

  return (
    <div className="status-chart">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default StatusChart;
