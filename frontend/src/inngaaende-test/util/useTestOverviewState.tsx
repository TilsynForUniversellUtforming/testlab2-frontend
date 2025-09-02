import { useCallback, useMemo, useState } from 'react';
import {
  getInitialPageType,
  getPageTypeList,
  isTestFinished,
  mapStatus,
  mapTestregelOverviewElements,
  progressionForSelection,
  toTestregelStatus,
  toTestregelStatusKey,
} from '@test/util/testregelUtils';
import { InnhaldstypeTesting, Testregel } from '@testreglar/api/types';
import {
  ActiveTest,
  ManuellTestStatus,
  PageType,
  TestResultUpdate,
} from '@test/types';
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

interface UseTestOverviewStateProps {
  testgrunnlagId: number;
  loeysingId: number;
  innhaldstypeList: InnhaldstypeTesting[];
  sideutvalTypeList: SideutvalType[];
  testResultatForLoeysing: ResultatManuellKontroll[];
  sideutvalForLoeysing: Sideutval[];
  testreglarForLoeysing: Testregel[];
  testKeys: any;
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
  const [testFerdig, setTestFerdig] = useState(
    isTestFinished(testResultatForLoeysing, testKeys)
  );

  const [alert, setAlert, modalRef] = useAlertModal();

  const pageTypeList = useMemo(
    () => getPageTypeList(sideutvalForLoeysing, sideutvalTypeList),
    [sideutvalForLoeysing, sideutvalTypeList]
  );

  const [pageType, setPageType] = useState<PageType>(
    getInitialPageType(pageTypeList)
  );

  const sideId = pageType.sideId;

  const [progressionPercent, setProgressionPercent] = useState(
    progressionForSelection(
      testreglarForLoeysing,
      testResultatForLoeysing,
      sideId,
      innhaldstype
    )
  );

  const [testregelListElements, setTestregelListElements] = useState(
    mapTestregelOverviewElements(
      testreglarForLoeysing,
      innhaldstype,
      sideId,
      testKeys
    )
  );

  const [testStatusMap, setTestStatusMap] = useState(
    toTestregelStatus(
      testregelListElements,
      testResultatForLoeysing,
      testgrunnlagId,
      sideId
    )
  );

  const [showHelpText, setShowHelpText] = useState(true);

  const toggleShowHelpText = () => {
    setShowHelpText((prev) => !prev);
  };

  function getTestregelStatus(nextTestregel: Testregel) {
    const statusKey = toTestregelStatusKey(
      testgrunnlagId,
      nextTestregel.id,
      sideId
    );
    return testStatusMap.get(statusKey);
  }
  function filterTestregelList(
    testregelList: Testregel[],
    testregelId: number
  ): Testregel | undefined {
    return testregelList.find((tr) => tr.id === testregelId);
  }

  function testregelStatusIkkjeStarta(nextTestregel: Testregel): boolean {
    const testregelStatus = getTestregelStatus(nextTestregel);
    return !!(testregelStatus && testregelStatus === 'ikkje-starta');
  }

  function getTestresultsForLoeysing(testResults: ResultatManuellKontroll[]) {
    return testResults.filter((tr) => tr.loeysingId === loeysingId);
  }

  const processData = useCallback(
    (
      testResults: ResultatManuellKontroll[],
      sideId: number,
      innhaldstype: any,
      activeTestregel?: Testregel
    ) => {
      const testResultsLoeysing = getTestresultsForLoeysing(testResults);
      setTestResults(testResultsLoeysing);

      const testregelListElements = mapTestregelOverviewElements(
        testreglarForLoeysing,
        innhaldstype,
        sideId,
        testKeys
      );

      setTestregelListElements(testregelListElements);
      setProgressionPercent(
        progressionForSelection(
          testreglarForLoeysing,
          testResultsLoeysing,
          sideId,
          innhaldstype
        )
      );

      setTestStatusMap(
        toTestregelStatus(
          testregelListElements,
          testResultsLoeysing,
          testgrunnlagId,
          sideId
        )
      );

      const finished = isTestFinished(testResultsLoeysing, testKeys);
      setTestFerdig(finished);

      if (activeTestregel) {
        setActiveTest({
          testregel: activeTestregel,
          testResultList: testResultsLoeysing.filter(
            (tr) =>
              tr.testregelId === activeTestregel.id && tr.sideutvalId === sideId
          ),
        });
      }
    },
    [loeysingId, testreglarForLoeysing, testKeys, testgrunnlagId]
  );

  const onChangeSideutval = useCallback(
    (sideutvalId: number) => {
      const nextSideutval = pageTypeList.find(
        (pt) => pt.sideId === sideutvalId
      );
      if (nextSideutval) {
        setPageType(nextSideutval);
        setActiveTest(undefined);
        processData(testResults, nextSideutval.sideId, innhaldstype);
      } else {
        setAlert('danger', 'Kan ikkje velje sideutval', 'Ugylig sideutval');
      }
    },
    [pageTypeList, testResults, innhaldstype, processData, setAlert]
  );

  const onChangeInnhaldstype = useCallback(
    (innhaldstypeId: number) => {
      const nextInnhaldstype = innhaldstypeList.find(
        (it) => it.id === innhaldstypeId
      );
      if (nextInnhaldstype) {
        setInnhaldstype(nextInnhaldstype);
        setActiveTest(undefined);
        processData(testResults, sideId, nextInnhaldstype);
      } else {
        setAlert(
          'danger',
          'Kan ikkje velje innhaldstype',
          'Ugylig innhaldstype'
        );
      }
    },
    [innhaldstypeList, testResults, sideId, processData, setAlert]
  );

  const doUpdateTestResultStatus = useCallback(
    async (testResultat: ResultatManuellKontroll[]) => {
      try {
        const updatedTestResults = await updateTestResultatMany(testResultat);
        await createTestresultatAggregert(testgrunnlagId).catch((e) => {
          setAlert(
            'danger',
            'Kunne ikkje oppdatere aggregert resultat',
            `Oppdatering av aggregert resultat feila ${e}`
          );
        });
        processData(updatedTestResults, sideId, innhaldstype);
      } catch (e) {
        setAlert(
          'danger',
          'Kunne ikkje endre status',
          'Oppdatering av status for testresultat feila'
        );
      }
    },
    [activeTest, sideId, innhaldstype]
  );

  async function updateTestresultAndAggregations(
    testResult: ResultatManuellKontroll
  ) {
    try {
      const updatedTestResults = await updateTestResultat(testResult);
      await createTestresultatAggregert(testgrunnlagId).catch((e) => {
        setAlert(
          'danger',
          'Kunne ikkje oppdatere aggregert resultat',
          `Oppdatering av aggregert resultat feila ${e}`
        );
      });
      processData(
        updatedTestResults,
        sideId,
        innhaldstype,
        activeTest?.testregel
      );
    } catch (e) {
      setAlert(
        'danger',
        'Kunne ikkje lagre',
        'Oppdatering av testresultat feila'
      );
    }
  }

  function getActiveTestresults(resultatId: number) {
    return testResults.find((testResult) => testResult.id === resultatId);
  }

  function updateTestresults(
    selectedTestresultat: ResultatManuellKontroll[],
    testregelId: number,
    newStatus: 'Ferdig' | 'Deaktivert' | 'UnderArbeid' | 'IkkjePaabegynt'
  ) {
    const updatedtestResults: ResultatManuellKontroll[] =
      selectedTestresultat.map((testResult) => ({
        id: testResult.id,
        testgrunnlagId: testgrunnlagId,
        loeysingId: loeysingId,
        testregelId: testregelId,
        sideutvalId: testResult.sideutvalId,
        elementOmtale: testResult.elementOmtale,
        elementResultat: testResult.elementResultat,
        elementUtfall: testResult.elementUtfall,
        testVartUtfoert: testResult.testVartUtfoert,
        svar: testResult.svar,
        status: newStatus,
        kommentar: testResult.kommentar,
        sistLagra: testResult.sistLagra,
      }));

    doUpdateTestResultStatus(updatedtestResults);
    if (testregelId === activeTest?.testregel.id) {
      setActiveTest(undefined);
    }
  }

  function checkIsElementSide(testregel: Testregel) {
    return (
      JSON.parse(testregel.testregelSchema).element.toLowerCase() === 'side'
    );
  }

  function isMissingComments(
    isElementSide: boolean,
    selectedTestresultat: ResultatManuellKontroll[]
  ) {
    return (
      isElementSide &&
      selectedTestresultat.filter((tr) => isDefined(tr.kommentar)).length !==
        selectedTestresultat.length
    );
  }

  function isNotFinished(selectedTestresultat: ResultatManuellKontroll[]) {
    const notFinished = selectedTestresultat.filter((tr) =>
      isNotDefined(tr.elementResultat)
    );
    return notFinished.length > 0;
  }

  function getSelectedTestresultat(testregelId: number, sideId: number) {
    return testResults.filter(
      (tr) => tr.testregelId === testregelId && tr.sideutvalId === sideId
    );
  }
  const doUpdateTestResult = useCallback(
    async (testResultUpdate: TestResultUpdate) => {
      const { resultatId, alleSvar, resultat, elementOmtale, kommentar } =
        testResultUpdate;
      const activeTestResult = getActiveTestresults(resultatId);

      if (
        isDefined(testgrunnlagId) &&
        isDefined(loeysingId) &&
        activeTest &&
        sideId &&
        activeTestResult
      ) {
        const testResult: ResultatManuellKontroll = {
          id: activeTestResult.id,
          testgrunnlagId: testgrunnlagId,
          loeysingId: loeysingId,
          testregelId: activeTest.testregel?.id,
          sideutvalId: sideId,
          elementOmtale,
          elementResultat: resultat && toElementResultat(resultat),
          elementUtfall: resultat?.utfall,
          svar: alleSvar,
          status: mapStatus('under-arbeid'),
          kommentar: kommentar,
          sistLagra: activeTestResult.sistLagra,
        };
        await updateTestresultAndAggregations(testResult);
      } else {
        setAlert(
          'danger',
          'Kunne ikkje lagre',
          'Ugyldig oppdatering av testresultat'
        );
      }
    },
    [activeTest, testResults, sideId, innhaldstype]
  );

  const doCreateTestResult = useCallback(
    async (activeTestregel: Testregel, sideutvalId: number | undefined) => {
      if (activeTestregel && sideutvalId) {
        try {
          await createNewTestResult(
            activeTestregel,
            testgrunnlagId,
            loeysingId,
            sideId
          );
        } catch (e) {
          setAlert('danger', 'Kunne ikkje lagre', 'Opprett testresultat feila');
        }
      } else {
        setAlert(
          'danger',
          'Kunne ikkje lagre',
          'Ugyldig oppretting av testresultat'
        );
      }
    },
    [activeTest, sideId, innhaldstype, testgrunnlagId]
  );

  const onChangeTestregel = useCallback(
    (testregelId: number) => {
      setActiveTest(undefined);
      const nextTestregel = filterTestregelList(
        testreglarForLoeysing,
        testregelId
      );

      if (!nextTestregel) {
        setAlert(
          'danger',
          'Kan ikkje byta testregel',
          'Det oppstod ein feil ved byting av testregel'
        );
      } else {
        if (nextTestregel.id === activeTest?.testregel.id) {
          setActiveTest(undefined);
          return;
        }

        if (testregelStatusIkkjeStarta(nextTestregel)) {
          doCreateTestResult(nextTestregel, sideId);
        } else {
          processData(testResults, sideId, innhaldstype, nextTestregel);
        }
      }
    },
    [testResults, sideId, innhaldstype, activeTest]
  );

  const onChangeTestregelStatus = useCallback(
    (status: ManuellTestStatus, testregelId: number) => {
      const testregel = filterTestregelList(testreglarForLoeysing, testregelId);
      const selectedTestresultat = getSelectedTestresultat(testregelId, sideId);

      if (testStatusMap && testregel) {
        if (status === 'under-arbeid' && isNotDefined(selectedTestresultat)) {
          doCreateTestResult(testregel, sideId);
          return;
        }

        if (status === 'ferdig') {
          if (isNotFinished(selectedTestresultat)) {
            setAlert(
              'warning',
              `Kan ikkje sette status ${status}`,
              'Ferdigstatus kan ikkje settast før man har eit utfall for alle testelement'
            );
            return;
          }
          if (
            isMissingComments(
              checkIsElementSide(testregel),
              selectedTestresultat
            )
          ) {
            setAlert(
              'warning',
              `Kan ikkje sette status ${status}`,
              'Ferdigstatus kan ikkje settast før alle testelement har kommentar til resultat'
            );
            return;
          }
        }

        updateTestresults(selectedTestresultat, testregelId, mapStatus(status));
      }
    },
    [testStatusMap, testResults, sideId, activeTest]
  );

  const slettTestelement = async (
    activeTest: ActiveTest,
    resultatId: number
  ) => {
    const resultat = testResults.find((tr) => tr.id === resultatId);
    if (!resultat) {
      setAlert(
        'danger',
        'Resultatet finnes ikkje',
        `Vi prøvde å slette resultatet med id ${resultatId}, men det eksisterer ikkje.`
      );
      return;
    }
    try {
      const alleResultater = await deleteTestResultat(resultat);
      processData(alleResultater, sideId, innhaldstype, activeTest.testregel);
    } catch (e) {
      setAlert(
        'danger',
        'Kunne ikkje slette test',
        'Sletting av test for testregel feila'
      );
    }
  };

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
    processData(alleResultater, sideId, innhaldstype, activeTestregel);
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
    createNewTestResult,
  };
};
