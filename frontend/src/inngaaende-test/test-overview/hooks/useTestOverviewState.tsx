import { useCallback, useMemo, useState } from 'react';
import {
  filterTestregelByTestKeys,
  isTestFinished,
  mapTestregelOverviewElements,
  progressionForSelection,
  toTestregelStatus,
} from '@test/util/testregelUtils';
import { InnhaldstypeTesting, Testregel } from '@testreglar/api/types';
import { Sideutval, SideutvalType } from '../../../kontroll/sideutval/types';
import { ResultatManuellKontroll } from '@test/api/types';

import { usePageType } from '@test/test-overview/hooks/usePageType';
import { useTestResults } from '@test/test-overview/hooks/useTestResults';
import { useTestResultatActions } from '@test/test-overview/hooks/useTestResultatActions';
import { useTestregelSelection } from '@test/test-overview/hooks/useTestregelSelection';
import { useTestSession } from '@test/test-overview/hooks/testSessionContext';
import { useTestOverviewElement } from '@test/test-overview/hooks/useTestOverviewElement';
import { Severity } from '@common/types';
import { ManuellTestStatus } from '@test/types';

export interface UseTestOverviewStateProps {
  testreglarForLoeysing: Testregel[];
  testKeys: string[];
  innhaldstypeList: InnhaldstypeTesting[];
}

export interface UseTestOverviewStateResult {
  innhaldstype: InnhaldstypeTesting;
  onChangeInnhaldstype: (innhaldstypeId: number) => void;
  pageType: ReturnType<typeof usePageType>['pageType'];
  pageTypeList: ReturnType<typeof usePageType>['pageTypeList'];
  onChangeSideutval: (sideId: number) => void;
  activeTest: ReturnType<typeof useTestResults>['activeTest'];
  setActiveTest: ReturnType<typeof useTestResults>['setActiveTest'];
  testFerdig: boolean;
  progressionPercent: number;
  testregelListElements: ReturnType<typeof mapTestregelOverviewElements>;
  testStatusMap: Map<string, ManuellTestStatus>;
  doUpdateTestResult: ReturnType<typeof useTestResultatActions>['doUpdateTestResult'];
  onChangeTestregel: ReturnType<typeof useTestregelSelection>['onChangeTestregel'];
  onChangeTestregelStatus: ReturnType<typeof useTestregelSelection>['onChangeTestregelStatus'];
  slettTestelement: ReturnType<typeof useTestResultatActions>['slettTestelement'];
  createNewTestResult: ReturnType<typeof useTestResultatActions>['createNewTestResult'];
  doSetTestregelOutcome: ReturnType<typeof useTestResultatActions>['doSetTestregelOutcome'];
}

export const useTestOverviewState = ({
  testreglarForLoeysing,
  testKeys,
  innhaldstypeList,
}: UseTestOverviewStateProps): UseTestOverviewStateResult => {
  // Get all shared state from context
  const {
    testgrunnlagId,
    sideId,
    innhaldstype,
    setInnhaldstype,
    pageType,
    pageTypeList,
    onChangeSideutval,
    activeTest,
    setActiveTest,
    testResults,
    testStatusMap,
    processData,
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

  const { testregelListElements } = useTestOverviewElement({
    testgrunnlagId,
    testResultatForLoeysing: testResults,
    testreglarForLoeysing,
    testKeys,
    sideId,
    innhaldstype,
    testResults,
  });

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

  // Get actions - now using context internally, no props needed
  const testResultatActions = useTestResultatActions();

  // Get selection - simplified props
  const testregelSelection = useTestregelSelection({
    testreglarForLoeysing,
    doCreateTestResult: testResultatActions.doCreateTestResult,
    doUpdateTestResultStatus: testResultatActions.doUpdateTestResultStatus,
  });

  return {
    innhaldstype,
    onChangeInnhaldstype,
    pageType,
    pageTypeList,
    onChangeSideutval,
    activeTest,
    setActiveTest,
    testFerdig,
    progressionPercent,
    testregelListElements,
    testStatusMap,
    doUpdateTestResult: testResultatActions.doUpdateTestResult,
    onChangeTestregel: testregelSelection.onChangeTestregel,
    onChangeTestregelStatus: testregelSelection.onChangeTestregelStatus,
    slettTestelement: testResultatActions.slettTestelement,
    createNewTestResult: testResultatActions.createNewTestResult,
    doSetTestregelOutcome: testResultatActions.doSetTestregelOutcome
  };
};
