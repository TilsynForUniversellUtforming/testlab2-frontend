import { useCallback, useMemo, useState } from 'react';

import {
  isTestFinished,
  mapStatus,
  mapTestregelOverviewElements,
  progressionForSelection,
  toTestregelStatus,
  toTestregelStatusKey,
} from '@test/util/testregelUtils';
import { InnhaldstypeTesting, Testregel } from '@testreglar/api/types';
import { ActiveTest, ManuellTestStatus, TestResultUpdate } from '@test/types';
import { Sideutval, SideutvalType } from '../../kontroll/sideutval/types';
import {
  CreateTestResultat,
  ResultatManuellKontroll,
  toElementResultat,
} from '@test/api/types';
import useAlertModal from '@common/alert/useAlertModal';
import {
  createTestResultat,
  deleteTestResultat,
  fetchTestResults,
  updateTestResultat,
  updateTestResultatMany,
} from '@test/api/testing-api';
import { createTestresultatAggregert } from '@resultat/resultat-api';
import { isDefined, isNotDefined } from '@common/util/validationUtils';
import { usePageType } from '@test/util/usePageType';

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
  const [testResults, setTestResults] = useState(testResultatForLoeysing);
  const [activeTest, setActiveTest] = useState<ActiveTest>();
  const [testFerdig, setTestFerdig] = useState(isTestFinished(testResultatForLoeysing, testKeys));
  const [showHelpText, setShowHelpText] = useState(true);

  const [, raiseAlert, modalRef] = useAlertModal();

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

  const toggleShowHelpText = () => setShowHelpText((prev) => !prev);

  // processData only needs to update testResults + testFerdig + activeTest
  // testregelListElements, testStatusMap, progressionPercent are all useMemo
  const processData = useCallback(
    (
      allResults: ResultatManuellKontroll[],
      currentSideId: number,
      activeTestregel?: Testregel
    ) => {
      const filtered = allResults.filter((tr) => tr.loeysingId === loeysingId);
      setTestResults(filtered);
      setTestFerdig(isTestFinished(filtered, testKeys));
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
    [innhaldstypeList, raiseAlert]
  );

  const withAggregert = useCallback(
    async (
      apiCall: () => Promise<ResultatManuellKontroll[]>,
      errorMsg: string,
      activeTestregel?: Testregel
    ) => {
      try {
        const updated = await apiCall();
        await createTestresultatAggregert(testgrunnlagId).catch((e) =>
          raiseAlert('danger', 'Kunne ikkje oppdatere aggregert resultat', `Oppdatering av aggregert resultat feila ${e}`)
        );
        processData(updated, sideId, activeTestregel);
      } catch {
        raiseAlert('danger', errorMsg, `${errorMsg} feila`);
      }
    },
    [testgrunnlagId, sideId, processData, raiseAlert]
  );

  const doUpdateTestResultStatus = useCallback(
    (testResultat: ResultatManuellKontroll[]) =>
      withAggregert(() => updateTestResultatMany(testResultat), 'Kunne ikkje endre status'),
    [withAggregert]
  );

  const doUpdateTestResult = useCallback(
    async (testResultUpdate: TestResultUpdate) => {
      const { resultatId, alleSvar, resultat, elementOmtale, kommentar } = testResultUpdate;
      const activeTestResult = testResults.find((tr) => tr.id === resultatId);

      if (activeTest && sideId && activeTestResult) {
        const testResult: ResultatManuellKontroll = {
          id: activeTestResult.id,
          testgrunnlagId,
          loeysingId,
          testregelId: activeTest.testregel?.id,
          sideutvalId: sideId,
          elementOmtale,
          elementResultat: resultat && toElementResultat(resultat),
          elementUtfall: resultat?.utfall,
          svar: alleSvar,
          status: mapStatus('under-arbeid'),
          kommentar,
          sistLagra: activeTestResult.sistLagra,
        };
        await withAggregert(() => updateTestResultat(testResult), 'Kunne ikkje lagre', activeTest.testregel);
      } else {
        raiseAlert('danger', 'Kunne ikkje lagre', 'Ugyldig oppdatering av testresultat');
      }
    },
    [activeTest, testResults, sideId, withAggregert, raiseAlert, testgrunnlagId, loeysingId]
  );

  const doCreateTestResult = useCallback(
    async (activeTestregel: Testregel, sideutvalId: number | undefined) => {
      if (!activeTestregel || !sideutvalId) {
        raiseAlert('danger', 'Kunne ikkje lagre', 'Ugyldig oppretting av testresultat');
        return;
      }
      try {
        await createTestResultat({ testgrunnlagId, loeysingId, testregelId: activeTestregel.id, sideutvalId } as CreateTestResultat);
        const alleResultater = await fetchTestResults(testgrunnlagId);
        processData(alleResultater, sideId, activeTestregel);
      } catch {
        raiseAlert('danger', 'Kunne ikkje lagre', 'Opprett testresultat feila');
      }
    },
    [sideId, testgrunnlagId, loeysingId, processData, raiseAlert]
  );

  const onChangeTestregel = useCallback(
    (testregelId: number) => {
      const nextTestregel = testreglarForLoeysing.find((tr) => tr.id === testregelId);
      if (!nextTestregel) {
        raiseAlert('danger', 'Kan ikkje byta testregel', 'Det oppstod ein feil ved byting av testregel');
        return;
      }
      if (nextTestregel.id === activeTest?.testregel.id) {
        setActiveTest(undefined);
        return;
      }
      const statusKey = toTestregelStatusKey(testgrunnlagId, nextTestregel.id, sideId);
      const isIkkjeStarta = testStatusMap.get(statusKey) === 'ikkje-starta';
      if (isIkkjeStarta) {
        doCreateTestResult(nextTestregel, sideId);
      } else {
        processData(testResults, sideId, nextTestregel);
      }
    },
    [testreglarForLoeysing, testStatusMap, testResults, sideId, activeTest, testgrunnlagId, processData, doCreateTestResult, raiseAlert]
  );



  const onChangeTestregelStatus = useCallback(
    (status: ManuellTestStatus, testregelId: number) => {
      const testregel = testreglarForLoeysing.find((tr) => tr.id === testregelId);
      const selected = testResults.filter((tr) => tr.testregelId === testregelId && tr.sideutvalId === sideId);

      if (!testStatusMap || !testregel) return;

      if (status === 'under-arbeid' && isNotDefined(selected)) {
        doCreateTestResult(testregel, sideId);
        return;
      }

      if (status === 'ferdig') {
        if (selected.some((tr) => isNotDefined(tr.elementResultat))) {
          raiseAlert('warning', `Kan ikkje sette status ${status}`, 'Ferdigstatus kan ikkje settast før man har eit utfall for alle testelement');
          return;
        }
        const isElementSide = JSON.parse(testregel.testregelSchema).element.toLowerCase() === 'side';
        if (isElementSide && selected.some((tr) => !isDefined(tr.kommentar))) {
          raiseAlert('warning', `Kan ikkje sette status ${status}`, 'Ferdigstatus kan ikkje settast før alle testelement har kommentar til resultat');
          return;
        }
      }

      const updated = selected.map((tr) => ({ ...tr, testregelId, status: mapStatus(status) }));
      doUpdateTestResultStatus(updated);
      if (testregelId === activeTest?.testregel.id) setActiveTest(undefined);
    },
    [testreglarForLoeysing, testStatusMap, testResults, sideId, activeTest, doCreateTestResult, doUpdateTestResultStatus, raiseAlert]
  );

  const slettTestelement = useCallback(
    async (activeTest: ActiveTest, resultatId: number) => {
      const resultat = testResults.find((tr) => tr.id === resultatId);
      if (!resultat) {
        raiseAlert('danger', 'Resultatet finnes ikkje', `Vi prøvde å slette resultatet med id ${resultatId}, men det eksisterer ikkje.`);
        return;
      }
      try {
        const alleResultater = await deleteTestResultat(resultat);
        processData(alleResultater, sideId, activeTest.testregel);
      } catch {
        raiseAlert('danger', 'Kunne ikkje slette test', 'Sletting av test for testregel feila');
      }
    },
    [testResults, sideId, processData, raiseAlert]
  );

  const createNewTestResult = async (
    activeTestregel: Testregel,
    testgrunnlagId: number,
    loeysingId: number,
    sideId: number
  ) => {
    const nyttTestresultat: CreateTestResultat = {
      testgrunnlagId: testgrunnlagId,
      loeysingId: loeysingId,
      testregelId: activeTestregel.id,
      sideutvalId: sideId,
    };
    await createTestResultat(nyttTestresultat);
    const alleResultater = await fetchTestResults(testgrunnlagId);
    processData(alleResultater, sideId, activeTestregel);
  };

  return {
    innhaldstype,
    setInnhaldstype,
    pageType,
    setPageType,
    activeTest,
    setActiveTest,
    testFerdig,
    progressionPercent,
    testregelListElements,
    testStatusMap,
    showHelpText,
    toggleShowHelpText,
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
    createNewTestResult,
  };
};
