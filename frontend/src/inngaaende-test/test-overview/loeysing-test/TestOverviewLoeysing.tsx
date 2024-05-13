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
import {
  CreateTestResultat,
  ResultatManuellKontroll,
  ResultatStatus,
  toElementResultat,
} from '@test/api/types';
import LoeysingTestContent from '@test/test-overview/loeysing-test/LoeysingTestContent';
import LoeysingTestHeading from '@test/test-overview/loeysing-test/LoeysingTestHeading';
import TestFerdig from '@test/test-overview/loeysing-test/TestFerdig';
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
  innhaldstypeAlle,
  isTestFinished,
  mapTestregelOverviewElements,
  toTestregelStatus,
  toTestregelStatusKey,
} from '@test/util/testregelUtils';
import {
  getInitialPageTypeSak,
  getNettsidePropertiesSak,
  progressionForLoeysingNettsideSak,
  toPageTypeSak,
} from '@test/util/testregelUtilsSak';
import { InnhaldstypeTesting, Testregel } from '@testreglar/api/types';
import { useCallback, useEffect, useState } from 'react';
import { useLoaderData, useOutletContext, useParams } from 'react-router-dom';

const TestOverviewLoeysing = () => {
  const { testgrunnlagId: testgrunnlagId, loeysingId } = useParams();
  const { contextSak, innhaldstypeList }: TestContext = useOutletContext();
  const [innhaldstype, setInnhaldstype] =
    useState<InnhaldstypeTesting>(innhaldstypeAlle);
  const { results } = useLoaderData() as TestOverviewLoaderResponse;

  const [testResults, setTestResults] =
    useState<ResultatManuellKontroll[]>(results);
  const [activeTest, setActiveTest] = useState<ActiveTest>();
  const [alert, setAlert, modalRef] = useAlertModal();
  const [testFerdig, setTestFerdig] = useState(false);

  const [nettsideProperties, setNettsideProperties] = useState(
    getNettsidePropertiesSak(contextSak, Number(loeysingId))
  );
  const [pageType, setPageType] = useState<PageType>(
    getInitialPageTypeSak(nettsideProperties)
  );
  const [progressionPercent, setProgressionPercent] = useState(
    progressionForLoeysingNettsideSak(
      contextSak,
      results,
      pageType.sideId,
      innhaldstype,
      Number(loeysingId)
    )
  );
  const [testregelList, setTestregelList] = useState(
    mapTestregelOverviewElements(contextSak.testreglar, innhaldstype)
  );
  const [testStatusMap, setTestStatusMap] = useState(
    toTestregelStatus(
      testregelList,
      results,
      Number(testgrunnlagId),
      Number(loeysingId),
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

    const nettsideProperties = getNettsidePropertiesSak(contextSak, loeysingId);

    setTestregelList(testregelList);
    setNettsideProperties(nettsideProperties);
    setProgressionPercent(
      progressionForLoeysingNettsideSak(
        contextSak,
        testResultsLoeysing,
        pageType.sideId,
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
        pageType.sideId
      )
    );

    const finished = isTestFinished(
      testResultsLoeysing,
      contextSak.testreglar.map((tr) => tr.id),
      loeysingId,
      nettsideProperties.length
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
          pageType.sideId
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
      nettsideId: pageType.sideId,
    };
    const alleResultater = await createTestResultat(nyttTestresultat);
    setTestResults(alleResultater);
    processData(
      contextSak,
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
        const nextPageType = toPageTypeSak(
          nettsideProperties,
          nettsideIdNumeric
        );
        setPageType(nextPageType);
        setActiveTest(undefined);
        processData(
          contextSak,
          testResults,
          Number(loeysingId),
          nextPageType,
          innhaldstype
        );
      } else {
        setAlert('danger', 'Kan ikkje byta side', 'Ugylig nettside');
      }
    },
    [contextSak, testResults, loeysingId, nettsideProperties, innhaldstype]
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
          contextSak,
          testResults,
          Number(loeysingId),
          pageType,
          innhaldstype
        );
      }
    },
    [contextSak, testResults, loeysingId, nettsideProperties, pageType]
  );

  const onChangeTestregel = useCallback(
    (testregelId: number) => {
      setActiveTest(undefined);
      const nextTestregel = contextSak.testreglar.find(
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
          pageType.sideId
        );
        const testregelStatus = testStatusMap.get(statusKey);

        if (testregelStatus && testregelStatus === 'ikkje-starta') {
          doCreateTestResult(
            sakIdNumeric,
            loeysingIdNumeric,
            nextTestregel,
            pageType.sideId
          );
        } else {
          processData(
            contextSak,
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
      contextSak,
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

      const testregel = contextSak.testreglar.find(
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
            pageType.sideId
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
      contextSak,
      testStatusMap,
      loeysingId,
      testResults,
      pageType.sideId,
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
            contextSak,
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
    [contextSak, loeysingId, activeTest, pageType, innhaldstype]
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
        pageType.sideId &&
        activeTestResult
      ) {
        const testResult: ResultatManuellKontroll = {
          id: activeTestResult.id,
          testgrunnlagId: sakIdNumeric,
          loeysingId: loeysingIdNumeric,
          testregelId: activeTest.testregel?.id,
          nettsideId: pageType.sideId,
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
            contextSak,
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
      pageType.sideId,
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
        contextSak,
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
          contextSak,
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
    [contextSak, loeysingId, activeTest, pageType, innhaldstype, testgrunnlagId]
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

  const loeysingNamn = contextSak.loeysingList[0].loeysing.namn;

  return (
    <div className="manual-test-container">
      <LoeysingTestHeading
        sakName={contextSak.verksemd.namn}
        currentLoeysingName={loeysingNamn}
        nettsideProperties={nettsideProperties}
        pageType={pageType}
        onChangePageType={onChangePageType}
        innhaldstypeList={innhaldstypeList}
        innhaldstype={innhaldstype}
        onChangeInnhaldstype={onChangeInnhaldstype}
      />
      <div className="manual-test-buttons">
        {testFerdig && <TestFerdig loeysingNamn={loeysingNamn} />}
        {!testFerdig && (
          <LoeysingTestContent
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
        )}
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
