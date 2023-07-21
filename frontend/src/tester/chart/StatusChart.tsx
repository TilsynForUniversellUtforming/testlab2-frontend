import './status-chart.scss';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';

interface ChartProps {
  numPerforming: number;
  numFinished: number;
  numError: number;
}

const StatusChart = ({ numPerforming, numFinished, numError }: ChartProps) => {
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
        text: 'Sider ',
      },
      tickInterval: 1,
    },
    tooltip: {
      valueSuffix: ' sider',
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
        name: 'Tester',
        color: '#0062ba',
        data: [{ y: numPerforming }],
      },
      {
        type: 'column',
        name: 'Ferdig',
        color: '#118849',
        data: [{ y: numFinished }],
      },
      {
        type: 'column',
        name: 'Feila',
        color: '#e02e49',
        data: [{ y: numError }],
      },
    ],
  };

  return (
    <div className="status-chart">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default StatusChart;
