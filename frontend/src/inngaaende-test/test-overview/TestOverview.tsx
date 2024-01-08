import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import { Sak } from '@sak/api/types';
import { LoeysingNettsideRelation } from '@sak/types';
import TestOverviewLoeysing from '@test/test-overview/loeysing-test/TestOverviewLoesying';
import TestLoeysingButton from '@test/test-overview/TestLoeysingButton';
import { ManualTestResult } from '@test/types';
import { useState } from 'react';

export interface Props {
  sakId: string;
  sak: Sak;
  testResults: ManualTestResult[];
}

const TestOverview = ({ sakId, sak, testResults }: Props) => {
  const [currentLoeysing, setCurrentLoeysing] =
    useState<LoeysingNettsideRelation>();
  const [alert, setAlert] = useAlert();

  const onChangeLoeysing = (loeysingId: number) => {
    const nextLoeysing = sak.loeysingList.find(
      (l) => l.loeysing.id === loeysingId
    );
    if (!nextLoeysing) {
      setAlert('danger', 'Det oppstod ein feil ved ending av løysing');
    } else {
      setCurrentLoeysing(nextLoeysing);
    }
  };

  if (currentLoeysing) {
    return (
      <TestOverviewLoeysing
        sakId={sakId}
        sak={sak}
        testResults={testResults}
        onClickBack={() => setCurrentLoeysing(undefined)}
      />
    );
  }

  return (
    <div className="manual-test-overview">
      {sak.loeysingList.map(({ loeysing }) => (
        <TestLoeysingButton
          key={loeysing.id}
          name={loeysing.namn}
          onClick={() => onChangeLoeysing(loeysing.id)}
        />
      ))}
      {alert && (
        <AlertTimed
          severity={alert.severity}
          message={alert.message}
          clearMessage={alert.clearMessage}
        />
      )}
    </div>
  );
};

export default TestOverview;
