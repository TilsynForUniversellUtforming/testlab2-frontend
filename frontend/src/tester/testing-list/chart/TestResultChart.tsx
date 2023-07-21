import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';

interface ChartProps {
  talSiderSamsvar: number;
  talSiderBrot: number;
  talSiderIkkjeForekomst: number;
}

const TestResultChart = ({
  talSiderSamsvar,
  talSiderBrot,
  talSiderIkkjeForekomst,
}: ChartProps) => {
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
        name: 'Samsvar',
        data: [{ y: talSiderSamsvar }],
      },
      {
        type: 'column',
        name: 'Brot',
        data: [{ y: talSiderBrot }],
      },
      {
        type: 'column',
        name: 'Ikkje forekomst',
        data: [{ y: talSiderIkkjeForekomst }],
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default TestResultChart;
