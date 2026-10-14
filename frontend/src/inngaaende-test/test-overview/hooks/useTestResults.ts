import { useCallback, useState } from 'react';
import { ResultatManuellKontroll } from '@test/api/types';
import { Testregel } from '@testreglar/api/types';
import { ActiveTest } from '@test/types';

export type ProcessData = (
  allResults: ResultatManuellKontroll[],
  currentSideId: number,
  activeTestregel?: Testregel
) => void;

export interface UseTestResultsProps {
  loeysingId: number;
  testResultatForLoeysing: ResultatManuellKontroll[];
}

export interface UseTestResultsResult {
  testResults: ResultatManuellKontroll[];
  activeTest: ActiveTest | undefined;
  setActiveTest: React.Dispatch<React.SetStateAction<ActiveTest | undefined>>;
  processData: ProcessData;
}

export const useTestResults = ({
  loeysingId,
  testResultatForLoeysing,
}: UseTestResultsProps): UseTestResultsResult => {
  const [testResults, setTestResults] = useState(testResultatForLoeysing);
  const [activeTest, setActiveTest] = useState<ActiveTest>();

  const processData = useCallback<ProcessData>(
    (allResults, currentSideId, activeTestregel) => {
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
    [loeysingId]
  );

  return { testResults, activeTest, setActiveTest, processData };
};
