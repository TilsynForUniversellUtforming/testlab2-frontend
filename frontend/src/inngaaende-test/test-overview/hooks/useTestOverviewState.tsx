import { useCallback, useMemo } from 'react';
import {
  isTestFinished,
  progressionForSelection,
} from '@test/util/testregelUtils';
import { InnhaldstypeTesting, Testregel } from '@testreglar/api/types';
import { useTestSession } from '@test/test-overview/hooks/testSessionContext';

export interface UseTestOverviewStateProps {
  testreglarForLoeysing: Testregel[];
  testKeys: string[];
  innhaldstypeList: InnhaldstypeTesting[];
}

export interface UseTestOverviewStateResult {
  onChangeInnhaldstype: (innhaldstypeId: number) => void;
  testFerdig: boolean;
  progressionPercent: number;
}

export const useTestOverviewState = ({
  testreglarForLoeysing,
  testKeys,
  innhaldstypeList,
}: UseTestOverviewStateProps): UseTestOverviewStateResult => {
  // Get all shared state from context
  const {
    sideId,
    innhaldstype,
    setInnhaldstype,
    setActiveTest,
    testResults,
    raiseAlert,
  } = useTestSession();

  const progressionPercent = useMemo(
    () =>
      progressionForSelection(
        testreglarForLoeysing,
        testResults,
        sideId,
        innhaldstype
      ),
    [testreglarForLoeysing, testResults, sideId, innhaldstype]
  );


  const testFerdig = useMemo(
    () => isTestFinished(testResults, testKeys),
    [testResults, testKeys]
  );

  const onChangeInnhaldstype = useCallback(
    (innhaldstypeId: number) => {
      const next = innhaldstypeList.find((it) => it.id === innhaldstypeId);
      if (next) {
        setInnhaldstype(next);
        setActiveTest(undefined);
      } else {
        raiseAlert(
          'danger',
          'Kan ikkje velje innhaldstype',
          'Ugyldig innhaldstype'
        );
      }
    },
    [innhaldstypeList, raiseAlert, setInnhaldstype, setActiveTest]
  );


  return {
    onChangeInnhaldstype,
    testFerdig,
    progressionPercent
  };
};
