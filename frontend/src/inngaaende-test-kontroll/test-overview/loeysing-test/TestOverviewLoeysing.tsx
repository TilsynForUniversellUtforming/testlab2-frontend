import AlertModal from '@common/alert/AlertModal';
import useAlertModal from '@common/alert/useAlertModal';
import { isDefined, isNotDefined } from '@common/util/validationUtils';
import { createTestresultatAggregert } from '@resultat/resultat-api';
import { Sak } from '@sak/api/types';
import {
  createTestResultat,
  deleteTestResultat,
  updateTestResultat,
  updateTestResultatMany,
} from '@test/api/testing-api';
import { CreateTestResultat, ResultatManuellKontroll, ResultatStatus, toElementResultat, } from '@test/api/types';
import LoeysingTestContent from '@test/test-overview/loeysing-test/LoeysingTestContent';
import LoeysingTestHeading from '@test/test-overview/loeysing-test/LoeysingTestHeading';
import {
  ActiveTest,
  ManuellTestStatus,
  PageType,
  TestContext,
  TestOverviewLoaderResponse,
  TestResultUpdate,
} from '@test/types';
import {
  findActiveTestResults,
  getInitialPageType,
  getNettsideProperties,
  innhaldstypeAlle,
  isTestFinished,
  mapTestregelOverviewElements,
  progressionForLoeysingNettside,
  toPageType,
  toTestregelStatus,
  toTestregelStatusKey,
} from '@test/util/testregelUtils';
import { InnhaldstypeTesting, Testregel } from '@testreglar/api/types';
import { useCallback, useEffect, useState } from 'react';
import { useLoaderData, useOutletContext, useParams } from 'react-router-dom';

const TestOverviewLoeysing = () => {
  const { testgrunnlagId: testgrunnlagId, loeysingId } = useParams();
  const { contextKontroll, innhaldstypeList }: TestContext = useOutletContext();
  const [innhaldstype, setInnhaldstype] =
    useState<InnhaldstypeTesting>(innhaldstypeAlle);
  const { results } = useLoaderData() as TestOverviewLoaderResponse;

  const [testResults, setTestResults] =
    useState<ResultatManuellKontroll[]>(results);
  const [activeTest, setActiveTest] = useState<ActiveTest>();
  const [alert, setAlert, modalRef] = useAlertModal();
  const [testFerdig, setTestFerdig] = useState(false);

  const [nettsideProperties, setNettsideProperties] = useState(
    getNettsideProperties(contextKontroll, Number(loeysingId))
  );
  const [pageType, setPageType] = useState<PageType>(
    getInitialPageType(nettsideProperties)
  );
  const [progressionPercent, setProgressionPercent] = useState(
    progressionForLoeysingNettside(
      contextKontroll,
      results,
      pageType.nettsideId,
      innhaldstype,
      Number(loeysingId)
    )
  );
  const [testregelList, setTestregelList] = useState(
    mapTestregelOverviewElements(contextKontroll.testreglar, innhaldstype)
  );
  const [testStatusMap, setTestStatusMap] = useState(
    toTestregelStatus(
      testregelList,
      results,
      Number(testgrunnlagId),
      Number(loeysingId),
      pageType.nettsideId
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
    contextSak: Sak,
    testResultsLoeysing: ResultatManuellKontroll[],
    loeysingId: number,
    pageType: PageType,
    innhaldstype: InnhaldstypeTesting,
    activeTestregel?: Testregel
  ) => {
    const testregelList = mapTestregelOverviewElements(
      contextSak.testreglar,
      innhaldstype
    );

    const nettsideProperties = getNettsideProperties(contextSak, loeysingId);

    setTestregelList(testregelList);
    setNettsideProperties(nettsideProperties);
    setProgressionPercent(
      progressionForLoeysingNettside(
        contextSak,
        testResultsLoeysing,
        pageType.nettsideId,
        innhaldstype,
        loeysingId
      )
    );

    setTestStatusMap(
      toTestregelStatus(
        testregelList,
        testResultsLoeysing,
        Number(testgrunnlagId),
        loeysingId,
        pageType.nettsideId
      )
    );

    const finished = isTestFinished(
      testResultsLoeysing,
      contextSak.testreglar.map((tr) => tr.id),
      loeysingId,
      nettsideProperties
    );
    setTestFerdig(finished);

    if (activeTestregel) {
      setActiveTest({
        testregel: activeTestregel,
        testResultList: findActiveTestResults(
          testResultsLoeysing,
          Number(testgrunnlagId),
          loeysingId,
          activeTestregel.id,
          pageType.nettsideId
        ),
      });
    }
  };

  const createNewTestResult = async (activeTest: ActiveTest) => {
    const numericLoeysingId = Number(loeysingId);

    const nyttTestresultat: CreateTestResultat = {
      testgrunnlagId: Number(testgrunnlagId),
      loeysingId: numericLoeysingId,
      testregelId: activeTest.testregel.id,
      nettsideId: pageType.nettsideId,
    };
    const alleResultater = await createTestResultat(nyttTestresultat);
    setTestResults(alleResultater);
    processData(
      contextKontroll,
      alleResultater,
      numericLoeysingId,
      pageType,
      innhaldstype,
      activeTest.testregel
    );
  };

  const onChangePageType = useCallback(
    (nettsideId?: string) => {
      const nettsideIdNumeric = Number(nettsideId);
      if (isDefined(nettsideIdNumeric)) {
        const nextPageType = toPageType(nettsideProperties, nettsideIdNumeric);
        setPageType(nextPageType);
        setActiveTest(undefined);
        processData(
          contextKontroll,
          testResults,
          Number(loeysingId),
          nextPageType,
          innhaldstype
        );
      } else {
        setAlert('danger', 'Kan ikkje byta side', 'Ugylig nettside');
      }
    },
    [contextKontroll, testResults, loeysingId, nettsideProperties, innhaldstype]
  );

  const onChangeInnhaldstype = useCallback(
    (innhaldstypeId: string) => {
      const innhaldstype = innhaldstypeList.find(
        (it) => it.id === Number(innhaldstypeId)
      );
      if (innhaldstype) {
        setInnhaldstype(innhaldstype);
        setActiveTest(undefined);
        processData(
          contextKontroll,
          testResults,
          Number(loeysingId),
          pageType,
          innhaldstype
        );
      }
    },
    [contextKontroll, testResults, loeysingId, nettsideProperties, pageType]
  );

  const onChangeTestregel = useCallback(
    (testregelId: number) => {
      setActiveTest(undefined);
      const nextTestregel = contextKontroll.testreglar.find(
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

        const sakIdNumeric = Number(testgrunnlagId);
        const loeysingIdNumeric = Number(loeysingId);

        const statusKey = toTestregelStatusKey(
          sakIdNumeric,
          loeysingIdNumeric,
          nextTestregel.id,
          pageType.nettsideId
        );
        const testregelStatus = testStatusMap.get(statusKey);

        if (testregelStatus && testregelStatus === 'ikkje-starta') {
          doCreateTestResult(
            sakIdNumeric,
            loeysingIdNumeric,
            nextTestregel,
            pageType.nettsideId
          );
        } else {
          processData(
            contextKontroll,
            testResults,
            Number(loeysingId),
            pageType,
            innhaldstype,
            nextTestregel
          );
        }
      }
    },
    [
      testgrunnlagId,
      loeysingId,
      contextKontroll,
      testResults,
      pageType,
      innhaldstype,
      activeTest,
    ]
  );

  const onChangeTestregelStatus = useCallback(
    (status: ManuellTestStatus, testregelId: number) => {
      const sakIdNumeric = Number(testgrunnlagId);
      const loeysingIdNumeric = Number(loeysingId);

      const testregel = contextKontroll.testreglar.find(
        (tr) => tr.id === testregelId
      );
      const selectedTestresultat = testResults.filter(
        (tr) => tr.testregelId === testregelId
      );
      const newStatus = mapStatus(status);

      if (testStatusMap && testregel) {
        if (status === 'under-arbeid' && isNotDefined(selectedTestresultat)) {
          doCreateTestResult(
            sakIdNumeric,
            loeysingIdNumeric,
            testregel,
            pageType.nettsideId
          );
        } else {
          const isElementSide =
            JSON.parse(testregel.testregelSchema).element.toLowerCase() ===
            'side';
          const missingKommentar =
            isElementSide &&
            selectedTestresultat.filter((tr) => isDefined(tr.kommentar))
              .length !== selectedTestresultat.length;

          const notFinished = selectedTestresultat.filter((tr) =>
            isNotDefined(tr.elementResultat)
          );
          if (status === 'ferdig' && notFinished.length > 0) {
            setAlert(
              'warning',
              `Kan ikkje sette status ${status}`,
              'Ferdigstatus kan ikkje settast før man har eit utfall for alle testelement'
            );
          } else if (status === 'ferdig' && missingKommentar) {
            setAlert(
              'warning',
              `Kan ikkje sette status ${status}`,
              'Ferdigstatus kan ikkje settast før alle testelement har kommentar til resultat'
            );
          } else {
            const updatedtestResults: ResultatManuellKontroll[] =
              selectedTestresultat.map((testResult) => ({
                id: testResult.id,
                testgrunnlagId: sakIdNumeric,
                loeysingId: loeysingIdNumeric,
                testregelId: testregelId,
                nettsideId: testResult.nettsideId,
                elementOmtale: testResult.elementOmtale,
                elementResultat: testResult.elementResultat,
                elementUtfall: testResult.elementUtfall,
                testVartUtfoert: testResult.testVartUtfoert,
                svar: testResult.svar,
                status: newStatus,
                kommentar: testResult.kommentar,
              }));

            doUpdateTestResultStatus(updatedtestResults);
            if (testregelId === activeTest?.testregel.id) {
              setActiveTest(undefined);
            }
          }
        }
      }
    },
    [
      contextKontroll,
      testStatusMap,
      loeysingId,
      testResults,
      pageType.nettsideId,
      activeTest,
    ]
  );

  // Create test result when the block is opened
  const doCreateTestResult = useCallback(
    async (
      sakId: number,
      loeysingId: number,
      activeTestregel: Testregel,
      nettsideId: number | undefined
    ) => {
      if (activeTestregel && nettsideId) {
        const testResult: CreateTestResultat = {
          testgrunnlagId: sakId,
          loeysingId: loeysingId,
          testregelId: activeTestregel.id,
          nettsideId: nettsideId,
        };

        try {
          const createdTestResults = await createTestResultat(testResult);
          setTestResults(createdTestResults);
          processData(
            contextKontroll,
            createdTestResults,
            loeysingId,
            pageType,
            innhaldstype,
            activeTestregel
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
    [contextKontroll, loeysingId, activeTest, pageType, innhaldstype]
  );

  const doUpdateTestResult = useCallback(
    async (testResultUpdate: TestResultUpdate) => {
      const { resultatId, alleSvar, resultat, elementOmtale, kommentar } =
        testResultUpdate;
      const sakIdNumeric = Number(testgrunnlagId);
      const loeysingIdNumeric = Number(loeysingId);

      const activeTestResult = testResults.find(
        (testResult) => testResult.id === resultatId
      );

      if (
        isDefined(sakIdNumeric) &&
        isDefined(loeysingIdNumeric) &&
        activeTest &&
        pageType.nettsideId &&
        activeTestResult
      ) {
        const testResult: ResultatManuellKontroll = {
          id: activeTestResult.id,
          testgrunnlagId: sakIdNumeric,
          loeysingId: loeysingIdNumeric,
          testregelId: activeTest.testregel?.id,
          nettsideId: pageType.nettsideId,
          elementOmtale,
          elementResultat: resultat && toElementResultat(resultat),
          elementUtfall: resultat?.utfall,
          svar: alleSvar,
          status: mapStatus('under-arbeid'),
          kommentar: kommentar,
        };

        try {
          const updatedTestResults = await updateTestResultat(testResult);
          await createTestresultatAggregert(Number(testgrunnlagId)).catch(
            (e) => {
              setAlert(
                'danger',
                'Kunne ikkje oppdatere aggregert resultat',
                `Oppdatering av aggregert resultat feila ${e}`
              );
            }
          );
          setTestResults(updatedTestResults);
          processData(
            contextKontroll,
            updatedTestResults,
            loeysingIdNumeric,
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
    [
      testgrunnlagId,
      loeysingId,
      activeTest,
      testResults,
      pageType.nettsideId,
      innhaldstype,
    ]
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
      setTestResults(alleResultater);
      processData(
        contextKontroll,
        alleResultater,
        Number(loeysingId),
        pageType,
        innhaldstype,
        activeTest.testregel
      );
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
        await createTestresultatAggregert(Number(testgrunnlagId)).catch((e) => {
          setAlert(
            'danger',
            'Kunne ikkje oppdatere aggregert resultat',
            `Oppdatering av aggregert resultat feila ${e}`
          );
        });
        setTestResults(updatedTestResults);
        processData(
          contextKontroll,
          updatedTestResults,
          Number(loeysingId),
          pageType,
          innhaldstype
        );
      } catch (e) {
        setAlert(
          'danger',
          'Kunne ikkje endre status',
          'Oppdatering av status for testresultat feila'
        );
      }
    },
    [contextKontroll, loeysingId, activeTest, pageType, innhaldstype, testgrunnlagId]
  );

  const mapStatus = (frontendState: ManuellTestStatus): ResultatStatus => {
    switch (frontendState) {
      case 'ferdig':
        return 'Ferdig';
      case 'deaktivert':
        return 'Deaktivert';
      case 'under-arbeid':
        return 'UnderArbeid';
      case 'ikkje-starta':
        return 'IkkjePaabegynt';
    }
  };

  useEffect(() => {
    if (alert) {
      modalRef.current?.showModal();
    }
  }, [alert]);

  return (
    <div className="manual-test-container">
      <LoeysingTestHeading
        sakName={contextKontroll.verksemd.namn}
        currentLoeysingName={contextKontroll.loeysingList[0].loeysing.namn}
        nettsideProperties={nettsideProperties}
        pageType={pageType}
        onChangePageType={onChangePageType}
        innhaldstypeList={innhaldstypeList}
        innhaldstype={innhaldstype}
        onChangeInnhaldstype={onChangeInnhaldstype}
      />
      <div className="manual-test-buttons">
        <LoeysingTestContent
          testFerdig={testFerdig}
          pageType={pageType}
          innhaldstype={innhaldstype}
          progressionPercent={progressionPercent}
          testStatusMap={testStatusMap}
          testregelList={testregelList}
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
  );
};

export default TestOverviewLoeysing;
