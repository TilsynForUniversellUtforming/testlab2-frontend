import AlertModal from '@common/alert/AlertModal';
import useAlertModal from '@common/alert/useAlertModal';
import { isDefined, isNotDefined } from '@common/util/validationUtils';
import { createTestresultatAggregert } from '@resultat/resultat-api';
import {
  createTestResultat,
  deleteTestResultat,
  fetchTestResults,
  updateTestResultat,
  updateTestResultatMany,
} from '@test/api/testing-api';
import {
  CreateTestResultat,
  ResultatManuellKontroll,
  toElementResultat,
} from '@test/api/types';
import LoeysingTestContent from '@test/test-overview/loeysing-test/LoeysingTestContent';
import LoeysingTestHeading from '@test/test-overview/loeysing-test/LoeysingTestHeading';
import TestFerdig from '@test/test-overview/loeysing-test/TestFerdig';
import {
  ActiveTest,
  ManuellTestStatus,
  PageType,
  TestOverviewLoaderResponse,
  TestResultUpdate,
} from '@test/types';
import {
  findActiveTestResults,
  getInitialPageType,
  getPageTypeList,
  innhaldstypeAlle,
  isTestFinished,
  mapStatus,
  mapTestregelOverviewElements,
  progressionForSelection,
  toTestregelStatus,
  toTestregelStatusKey,
} from '@test/util/testregelUtils';
import { InnhaldstypeTesting, Testregel } from '@testreglar/api/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';

const TestOverviewLoeysing = () => {
  const { testgrunnlagId: testgrunnlagIdParam, loeysingId: loeysingIdParam } =
    useParams();
  const loeysingId = Number(loeysingIdParam);
  const testgrunnlagId = Number(testgrunnlagIdParam);

  const [innhaldstype, setInnhaldstype] =
    useState<InnhaldstypeTesting>(innhaldstypeAlle);

  const {
    testResultatForLoeysing,
    sideutvalForLoeysing,
    testreglarForLoeysing,
    activeLoeysing,
    kontrollTitle,
    testKeys,
    sideutvalTypeList,
    innhaldstypeList,
  } = useLoaderData() as TestOverviewLoaderResponse;

  const [testResults, setTestResults] = useState<ResultatManuellKontroll[]>(
    testResultatForLoeysing
  );

  const [activeTest, setActiveTest] = useState<ActiveTest>();
  const [alert, setAlert, modalRef] = useAlertModal();
  const [testFerdig, setTestFerdig] = useState(
    isTestFinished(testResults, testKeys)
  );

  const pageTypeList = useMemo(
    () => getPageTypeList(sideutvalForLoeysing, sideutvalTypeList),
    [sideutvalForLoeysing, sideutvalTypeList]
  );

  const [pageType, setPageType] = useState<PageType>(
    getInitialPageType(pageTypeList)
  );

  const [progressionPercent, setProgressionPercent] = useState(
    progressionForSelection(
      testreglarForLoeysing,
      testResultatForLoeysing,
      pageType.sideId,
      innhaldstype
    )
  );
  const [testregelListElements, setTestregelListElements] = useState(
    mapTestregelOverviewElements(
      testreglarForLoeysing,
      innhaldstype,
      pageType.sideId,
      testKeys
    )
  );
  const [testStatusMap, setTestStatusMap] = useState(
    toTestregelStatus(
      testregelListElements,
      testResultatForLoeysing,
      testgrunnlagId,
      pageType.sideId
    )
  );

  const [showHelpText, setShowHelpText] = useState(true);

  const toggleShowHelpText = () => {
    setShowHelpText((showHelpText) => !showHelpText);
  };

  const handleSetInactiveTest = useCallback(() => {
    setActiveTest(undefined);
  }, []);

  const processData = (
    testResults: ResultatManuellKontroll[],
    pageType: PageType,
    innhaldstype: InnhaldstypeTesting,
    activeTestregel?: Testregel
  ) => {
    const testResultsLoeysing = testResults.filter(
      (tr) => tr.loeysingId === loeysingId
    );
    setTestResults(testResultsLoeysing);

    const testregelListElements = mapTestregelOverviewElements(
      testreglarForLoeysing,
      innhaldstype,
      pageType.sideId,
      testKeys
    );

    setTestregelListElements(testregelListElements);
    setProgressionPercent(
      progressionForSelection(
        testreglarForLoeysing,
        testResultsLoeysing,
        pageType.sideId,
        innhaldstype
      )
    );

    setTestStatusMap(
      toTestregelStatus(
        testregelListElements,
        testResultsLoeysing,
        testgrunnlagId,
        pageType.sideId
      )
    );

    const finished = isTestFinished(testResultsLoeysing, testKeys);
    setTestFerdig(finished);

    if (activeTestregel) {
      setActiveTest({
        testregel: activeTestregel,
        testResultList: findActiveTestResults(
          testResultsLoeysing,
          testgrunnlagId,
          activeTestregel.id,
          pageType.sideId
        ),
      });
    }
  };

  const createNewTestResult = async (activeTest: ActiveTest) => {
    const nyttTestresultat: CreateTestResultat = {
      testgrunnlagId: testgrunnlagId,
      loeysingId: loeysingId,
      testregelId: activeTest.testregel.id,
      sideutvalId: pageType.sideId,
    };
    await createTestResultat(nyttTestresultat);
    const alleResultater = await fetchTestResults(testgrunnlagId);
    processData(alleResultater, pageType, innhaldstype, activeTest.testregel);
  };

  const onChangeSideutval = useCallback(
    (sideutvalId: number) => {
      const nextSideutvalTestside = pageTypeList.find(
        (pt) => pt.sideId === sideutvalId
      );
      if (nextSideutvalTestside) {
        setPageType(nextSideutvalTestside);
        setActiveTest(undefined);
        processData(testResults, nextSideutvalTestside, innhaldstype);
      } else {
        setAlert('danger', 'Kan ikkje velje sideutval', 'Ugylig sideutval');
      }
    },
    [testResults, innhaldstype]
  );

  const onChangeInnhaldstype = useCallback(
    (innhaldstypeId: number) => {
      const nextInnhaldstype = innhaldstypeList.find(
        (it) => it.id === Number(innhaldstypeId)
      );
      if (nextInnhaldstype) {
        setInnhaldstype(nextInnhaldstype);
        setActiveTest(undefined);
        processData(testResults, pageType, nextInnhaldstype);
      } else {
        setAlert(
          'danger',
          'Kan ikkje velje innhaldstype',
          'Ugylig innhaldstype'
        );
      }
    },
    [testResults, pageType]
  );

  const onChangeTestregel = useCallback(
    (testregelId: number) => {
      setActiveTest(undefined);
      const nextTestregel = testreglarForLoeysing.find(
        (tr) => tr.id === testregelId
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

        const statusKey = toTestregelStatusKey(
          testgrunnlagId,
          nextTestregel.id,
          pageType.sideId
        );
        const testregelStatus = testStatusMap.get(statusKey);

        if (testregelStatus && testregelStatus === 'ikkje-starta') {
          doCreateTestResult(nextTestregel, pageType.sideId);
        } else {
          processData(testResults, pageType, innhaldstype, nextTestregel);
        }
      }
    },
    [testResults, pageType, innhaldstype, activeTest]
  );

  function checkIsElementSide(testregel: Testregel) {
    return (
      JSON.parse(testregel.testregelSchema).element.toLowerCase() === 'side'
    );
  }

  function checkAllResultsHasKommentar(
    selectedTestresultat: ResultatManuellKontroll[]
  ) {
    return (
      selectedTestresultat.filter((tr) => isDefined(tr.kommentar)).length !==
      selectedTestresultat.length
    );
  }

  function isMissingKommentar(
    testregel: Testregel,
    selectedTestresultat: ResultatManuellKontroll[]
  ) {
    return (
      checkIsElementSide(testregel) &&
      checkAllResultsHasKommentar(selectedTestresultat)
    );
  }

  function notFinishedResultat(
    selectedTestresultat: ResultatManuellKontroll[]
  ) {
    return (
      selectedTestresultat.filter((tr) => isNotDefined(tr.elementResultat))
        .length > 0
    );
  }

  function alertManglarResultat() {
    setAlert(
      'warning',
      `Kan ikkje sette status ferdig`,
      'Ferdigstatus kan ikkje settast før man har eit utfall for alle testelement'
    );
  }

  function validateTestresultat(
    status: ManuellTestStatus,
    testregel: Testregel,
    selectedTestresultat: ResultatManuellKontroll[]
  ) {
    if (status === 'ferdig' && notFinishedResultat(selectedTestresultat)) {
      alertManglarResultat();
      return false;
    } else if (
      status === 'ferdig' &&
      isMissingKommentar(testregel, selectedTestresultat)
    ) {
      alertManglarKommentar();
      return false;
    } else {
      return true;
    }
  }

  function alertManglarKommentar() {
    setAlert(
      'warning',
      `Kan ikkje sette status ferdig`,
      'Ferdigstatus kan ikkje settast før alle testelement har kommentar til resultat'
    );
  }

  function checkNoActiveTests(testregelId: number) {
    if (testregelId === activeTest?.testregel.id) {
      setActiveTest(undefined);
    }
  }

  function isNewTest(
    status: 'ferdig' | 'deaktivert' | 'under-arbeid' | 'ikkje-starta',
    selectedTestresultat: ResultatManuellKontroll[]
  ) {
    return status === 'under-arbeid' && isNotDefined(selectedTestresultat);
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
    checkNoActiveTests(testregelId);
  }

  function getCurrentTestregel(testregelId: number) {
    return testreglarForLoeysing.find((tr) => tr.id === testregelId);
  }

  function getSelectedTestresultat(testregelId: number) {
    return testResults.filter(
      (tr) =>
        tr.testregelId === testregelId && tr.sideutvalId === pageType.sideId
    );
  }

  const onChangeTestregelStatus = useCallback(
    (status: ManuellTestStatus, testregelId: number) => {
      const testregel = getCurrentTestregel(testregelId);
      const selectedTestresultat = getSelectedTestresultat(testregelId);

      if (testStatusMap && testregel) {
        if (isNewTest(status, selectedTestresultat)) {
          doCreateTestResult(testregel, pageType.sideId);
        } else if (
          validateTestresultat(status, testregel, selectedTestresultat)
        ) {
          updateTestresults(
            selectedTestresultat,
            testregelId,
            mapStatus(status)
          );
        }
      }
    },
    [testStatusMap, testResults, pageType.sideId, activeTest]
  );

  // Create test result when the block is opened
  const doCreateTestResult = useCallback(
    async (activeTestregel: Testregel, sideutvalId: number | undefined) => {
      if (activeTestregel && sideutvalId) {
        const testResult: CreateTestResultat = {
          testgrunnlagId: testgrunnlagId,
          loeysingId: loeysingId,
          testregelId: activeTestregel.id,
          sideutvalId: sideutvalId,
        };

        try {
          await createTestResultat(testResult);
          const results = await fetchTestResults(testgrunnlagId);
          processData(results, pageType, innhaldstype, activeTestregel);
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
    [activeTest, pageType, innhaldstype]
  );

  function getActiveTestResult(resultatId: number) {
    return testResults.find((testResult) => testResult.id === resultatId);
  }

  const doUpdateTestResult = useCallback(
    async (testResultUpdate: TestResultUpdate) => {
      const { resultatId, alleSvar, resultat, elementOmtale, kommentar } =
        testResultUpdate;
      const activeTestResult = getActiveTestResult(resultatId);

      if (
        isDefined(testgrunnlagId) &&
        isDefined(loeysingId) &&
        activeTest &&
        pageType.sideId &&
        activeTestResult
      ) {
        const testResult: ResultatManuellKontroll = {
          id: activeTestResult.id,
          testgrunnlagId: testgrunnlagId,
          loeysingId: loeysingId,
          testregelId: activeTest.testregel?.id,
          sideutvalId: pageType.sideId,
          elementOmtale,
          elementResultat: resultat && toElementResultat(resultat),
          elementUtfall: resultat?.utfall,
          svar: alleSvar,
          status: mapStatus('under-arbeid'),
          kommentar: kommentar,
          sistLagra: activeTestResult.sistLagra,
        };

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
            pageType,
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
      } else {
        setAlert(
          'danger',
          'Kunne ikkje lagre',
          'Ugyldig oppdatering av testresultat'
        );
      }
    },
    [activeTest, testResults, pageType.sideId, innhaldstype]
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
      processData(alleResultater, pageType, innhaldstype, activeTest.testregel);
    } catch (e) {
      setAlert(
        'danger',
        'Kunne ikkje slette test',
        'Sletting av test for testregel feila'
      );
    }
  };

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
        processData(updatedTestResults, pageType, innhaldstype);
      } catch (e) {
        setAlert(
          'danger',
          'Kunne ikkje endre status',
          'Oppdatering av status for testresultat feila'
        );
      }
    },
    [activeTest, pageType, innhaldstype]
  );

  useEffect(() => {
    if (alert) {
      modalRef.current?.showModal();
    }
  }, [alert]);

  const loeysingNamn = activeLoeysing.namn;

  return (
    <div className="manual-test-container">
      <LoeysingTestHeading
        title={kontrollTitle}
        currentLoeysingName={loeysingNamn}
        sideutvalList={pageTypeList}
        sideutval={pageType}
        onChangeSideutval={onChangeSideutval}
        innhaldstypeList={innhaldstypeList}
        innhaldstype={innhaldstype}
        onChangeInnhaldstype={onChangeInnhaldstype}
      />
      {testFerdig && <TestFerdig loeysingNamn={loeysingNamn} />}
      <div className="manual-test-wrapper">
        <div className="manual-test-buttons">
          <LoeysingTestContent
            sideutval={pageType}
            innhaldstype={innhaldstype}
            progressionPercent={progressionPercent}
            testStatusMap={testStatusMap}
            testregelList={testregelListElements}
            activeTest={activeTest}
            clearActiveTestregel={handleSetInactiveTest}
            onChangeTestregel={onChangeTestregel}
            createNewTestResult={createNewTestResult}
            doUpdateTestResult={doUpdateTestResult}
            slettTestelement={slettTestelement}
            onChangeStatus={onChangeTestregelStatus}
            toggleShowHelpText={toggleShowHelpText}
            showHelpText={showHelpText}
          />
        </div>
        {alert && (
          <AlertModal
            ref={modalRef}
            severity={alert.severity}
            title={alert.title}
            message={alert.message}
            clearMessage={alert.clearMessage}
          />
        )}
      </div>
    </div>
  );
};

export default TestOverviewLoeysing;
