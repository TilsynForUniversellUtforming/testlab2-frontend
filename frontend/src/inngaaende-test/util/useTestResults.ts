import { useCallback, useState } from 'react';
import { isTestFinished } from '@test/util/testregelUtils';
import { ResultatManuellKontroll } from '@test/api/types';
import { Testregel } from '@testreglar/api/types';
import { ActiveTest } from '@test/types';

interface UseTestResultsProps {
  loeysingId: number;
  testResultatForLoeysing: ResultatManuellKontroll[];
  testKeys: string[];
}

export const useTestResults = ({
  loeysingId,
  testResultatForLoeysing,
  testKeys,
}: UseTestResultsProps) => {
  const [testResults, setTestResults] = useState(testResultatForLoeysing);
  const [activeTest, setActiveTest] = useState<ActiveTest>();

  const processData = useCallback(
    (
      allResults: ResultatManuellKontroll[],
      currentSideId: number,
      activeTestregel?: Testregel
    ) => {
      const filtered = allResults.filter((tr) => tr.loeysingId === loeysingId);
      setTestResults(filtered);
      if (activeTestregel) {
        setActiveTest({
          testregel: activeTestregel,
          testResultList: filtered.filter(
            (tr) => tr.testregelId === activeTestregel.id && tr.sideutvalId === currentSideId
          ),
        });
      }
    },
    [loeysingId, testKeys]
  );

  return { testResults,  activeTest, setActiveTest, processData };
};

