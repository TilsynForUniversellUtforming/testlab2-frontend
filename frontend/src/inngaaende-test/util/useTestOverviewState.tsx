import { useCallback, useMemo, useState } from 'react';
import {
  mapTestregelOverviewElements,
  progressionForSelection,
  toTestregelStatus,
} from '@test/util/testregelUtils';
import { InnhaldstypeTesting, Testregel } from '@testreglar/api/types';
import { ManuellTestStatus } from '@test/types';
import { Sideutval, SideutvalType } from '../../kontroll/sideutval/types';
import { ResultatManuellKontroll } from '@test/api/types';
import useAlertModal from '@common/alert/useAlertModal';
import { usePageType } from '@test/util/usePageType';
import { useTestResults } from '@test/util/useTestResults';
import { useTestResultatActions } from '@test/util/useTestResultatActions';
import { useTestregelSelection } from '@test/util/useTestregelSelection';

interface UseTestOverviewStateProps {
  testgrunnlagId: number;
  loeysingId: number;
  innhaldstypeList: InnhaldstypeTesting[];
  sideutvalTypeList: SideutvalType[];
  testResultatForLoeysing: ResultatManuellKontroll[];
  sideutvalForLoeysing: Sideutval[];
  testreglarForLoeysing: Testregel[];
  testKeys: string[];
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
}: UseTestOverviewStateProps) => {
  const [innhaldstype, setInnhaldstype] = useState(innhaldstypeList[0]);
  const [showHelpText, setShowHelpText] = useState(true);
  const [, raiseAlert, modalRef] = useAlertModal();

  const { testResults, testFerdig, activeTest, setActiveTest, processData } = useTestResults({
    loeysingId,
    testResultatForLoeysing,
    testKeys,
  });

  const { pageTypeList, pageType, setPageType, sideId, onChangeSideutval } = usePageType({
    sideutvalForLoeysing,
    sideutvalTypeList,
    onSideutvalNotFound: () => raiseAlert('danger', 'Kan ikkje velje sideutval', 'Ugylig sideutval'),
    onSideutvalChanged: (nextSideId) => {
      setActiveTest(undefined);
      processData(testResults, nextSideId);
    },
  });

  const progressionPercent = useMemo(
    () => progressionForSelection(testreglarForLoeysing, testResults, sideId, innhaldstype),
    [testreglarForLoeysing, testResults, sideId, innhaldstype]
  );

  const testregelListElements = useMemo(
    () => mapTestregelOverviewElements(testreglarForLoeysing, innhaldstype, sideId, testKeys),
    [testreglarForLoeysing, innhaldstype, sideId, testKeys]
  );

  const testStatusMap = useMemo(
    () => toTestregelStatus(testregelListElements, testResults, testgrunnlagId, sideId),
    [testregelListElements, testResults, testgrunnlagId, sideId]
  );

  const onChangeInnhaldstype = useCallback(
    (innhaldstypeId: number) => {
      const next = innhaldstypeList.find((it) => it.id === innhaldstypeId);
      if (next) {
        setInnhaldstype(next);
        setActiveTest(undefined);
      } else {
        raiseAlert('danger', 'Kan ikkje velje innhaldstype', 'Ugylig innhaldstype');
      }
    },
    [innhaldstypeList, raiseAlert, setActiveTest]
  );

  const { doUpdateTestResultStatus, doUpdateTestResult, doCreateTestResult, slettTestelement , createNewTestResult} =
    useTestResultatActions({
      testgrunnlagId,
      loeysingId,
      sideId,
      testResults,
      activeTest,
      processData,
      raiseAlert,
    });

  const { onChangeTestregel, onChangeTestregelStatus } = useTestregelSelection({
    testgrunnlagId,
    sideId,
    testResults,
    testStatusMap: testStatusMap as Map<string, ManuellTestStatus>,
    testreglarForLoeysing,
    activeTest,
    setActiveTest,
    doCreateTestResult,
    doUpdateTestResultStatus,
    processData,
    raiseAlert,
  });

  return {
    innhaldstype,
    pageType,
    setPageType,
    activeTest,
    setActiveTest,
    testFerdig,
    progressionPercent,
    testregelListElements,
    testStatusMap,
    showHelpText,
    toggleShowHelpText: () => setShowHelpText((prev) => !prev),
    onChangeSideutval,
    onChangeInnhaldstype,
    pageTypeList,
    doUpdateTestResultStatus,
    doUpdateTestResult,
    doCreateTestResult,
    onChangeTestregel,
    onChangeTestregelStatus,
    slettTestelement,
    modalRef,
    createNewTestResult
  };
};
