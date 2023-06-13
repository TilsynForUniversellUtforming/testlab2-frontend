import { useEffect, useState } from 'react';

import { Maaling } from '../api/types';

export type ProcessStatus = {
  canStartProcess: boolean;
  label: string;
  finished: boolean;
  failed: boolean;
  showResult: boolean;
};

export type MaalingOverviewStatus = {
  crawlingStatus: ProcessStatus;
  testingStatus: ProcessStatus;
};

const useMaalingOverviewStatus = (maaling: Maaling): MaalingOverviewStatus => {
  const loeysingLength = maaling.loeysingList.length;

  const toLabel = (label: string, numProcessed: number) =>
    `${label} (${numProcessed}/${loeysingLength})`;

  const [crawlingStatus, setCrawlingStatus] = useState<ProcessStatus>({
    canStartProcess: false,
    label: toLabel('Sideutval', 0),
    finished: false,
    failed: false,
    showResult: false,
  });

  const [testingStatus, setTestingStatus] = useState<ProcessStatus>({
    canStartProcess: false,
    label: toLabel('Testing', 0),
    finished: false,
    failed: false,
    showResult: true,
  });

  useEffect(() => {
    const isPlanning = maaling.status === 'planlegging';
    const crawlingJobFinished = [
      'kvalitetssikring',
      'testing',
      'testing_ferdig',
    ].includes(maaling.status);
    const crawlingFailed = maaling.crawlStatistics.numError > 0;
    const canStartTest =
      maaling.status === 'kvalitetssikring' && !crawlingFailed;

    setCrawlingStatus({
      canStartProcess: isPlanning,
      label: toLabel('Sideutval', maaling.crawlStatistics.numFinished),
      finished: crawlingJobFinished,
      failed: crawlingFailed,
      showResult: true,
    });

    const testingJobFinished = maaling.status === 'testing_ferdig';
    const testingFailed = maaling.testStatistics.numError > 0;
    const showTestLink = ['testing', 'testing_ferdig'].includes(maaling.status);

    setTestingStatus({
      canStartProcess: canStartTest,
      label: toLabel('Testing', maaling.testStatistics.numFinished),
      finished: testingJobFinished,
      failed: testingFailed,
      showResult: showTestLink,
    });
  }, [maaling]);

  return {
    crawlingStatus: crawlingStatus,
    testingStatus: testingStatus,
  };
};

export default useMaalingOverviewStatus;
