import { useCallback, useMemo, useState } from 'react';
import {
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
import { Severity } from '@common/types';
import { ManuellTestStatus } from '@test/types';

export interface UseTestOverviewStateProps {
  testgrunnlagId: number;
  loeysingId: number;
  innhaldstypeList: InnhaldstypeTesting[];
  sideutvalTypeList: SideutvalType[];
  testResultatForLoeysing: ResultatManuellKontroll[];
  sideutvalForLoeysing: Sideutval[];
  testreglarForLoeysing: Testregel[];
  testKeys: string[];
  raiseAlert: (severity: Severity, title: string, message: string) => void;
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
}

export const useTestOverviewState = ({
  testgrunnlagId,
  loeysingId,
  innhaldstypeList,
  sideutvalTypeList,
  testResultatForLoeysing,
  sideutvalForLoeysing,
  testreglarForLoeysing,
  testKeys,
  raiseAlert,
}: UseTestOverviewStateProps): UseTestOverviewStateResult => {
  const [innhaldstype, setInnhaldstype] = useState(innhaldstypeList[0]);

  const { testResults, activeTest, setActiveTest, processData } = useTestResults({
    loeysingId,
    testResultatForLoeysing,
  });

  const { pageTypeList, pageType, sideId, onChangeSideutval } = usePageType({
    sideutvalForLoeysing,
    sideutvalTypeList,
    onSideutvalNotFound: () =>
      raiseAlert('danger', 'Kan ikkje velje sideutval', 'Ugylig sideutval'),
    onSideutvalChanged: () => {
      setActiveTest(undefined);
    },
  });

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

  const testregelListElements = useMemo(
    () =>
      mapTestregelOverviewElements(
        testreglarForLoeysing,
        innhaldstype,
        sideId,
        testKeys
      ),
    [testreglarForLoeysing, innhaldstype, sideId, testKeys]
  );

  const testStatusMap = useMemo(
    () =>
      toTestregelStatus(
        testregelListElements,
        testResults,
        testgrunnlagId,
        sideId
      ),
    [testregelListElements, testResults, testgrunnlagId, sideId]
  );

  const testFerdig = useMemo(
    () => isTestFinished(testResultatForLoeysing, testKeys),
    [testResultatForLoeysing, testKeys]
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
          'Ugylig innhaldstype'
        );
      }
    },
    [innhaldstypeList, raiseAlert, setActiveTest]
  );

  const testResultatActions = useTestResultatActions({
    testgrunnlagId,
    loeysingId,
    sideId,
    testResults,
    activeTest,
    processData,
    raiseAlert,
  });

  const testregelSelection = useTestregelSelection({
    testgrunnlagId,
    sideId,
    testResults,
    testStatusMap,
    testreglarForLoeysing,
    activeTest,
    setActiveTest,
    testregelActions: {
      createResult: testResultatActions.doCreateTestResult,
      updateStatus: testResultatActions.doUpdateTestResultStatus,
    },
    processData,
    raiseAlert,
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
  };
};
