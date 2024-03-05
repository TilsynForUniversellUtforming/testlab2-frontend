import AlertModal from '@common/alert/AlertModal';
import useAlertModal from '@common/alert/useAlertModal';
import { isDefined, isNotDefined } from '@common/util/validationUtils';
import { Sak } from '@sak/api/types';
import {
  createTestResultat,
  updateTestResultat,
  updateTestResultatMany,
} from '@test/api/testing-api';
import {
  CreateTestResultat,
  ResultatManuellKontroll,
  ResultatStatus,
  Svar,
  toElementResultat,
} from '@test/api/types';
import LoeysingTestContent from '@test/test-overview/loeysing-test/LoeysingTestContent';
import LoeysingTestHeading from '@test/test-overview/loeysing-test/LoeysingTestHeading';
import {
  ActiveTest,
  ManuellTestStatus,
  PageType,
  TestContext,
} from '@test/types';
import { TestregelResultat } from '@test/util/testregelParser';
import {
  findActiveTestResults,
  getInitialPageType,
  getNettsideProperties,
  getTestResultsForLoeysing,
  innhaldstypeAlle,
  mapTestregelOverviewElements,
  progressionForLoeysingNettside,
  toPageType,
  toTestregelStatus,
  toTestregelStatusKey,
} from '@test/util/testregelUtils';
import { InnhaldstypeTesting, Testregel } from '@testreglar/api/types';
import { useCallback, useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

const TestOverviewLoeysing = () => {
  const { id: sakId, loeysingId } = useParams();
  const {
    contextSak,
    contextTestResults,
    contextSetTestResults,
    innhaldstypeList,
  }: TestContext = useOutletContext();
  const [innhaldstype, setInnhaldstype] =
    useState<InnhaldstypeTesting>(innhaldstypeAlle);
  const [activeTest, setActiveTest] = useState<ActiveTest>();
  const [alert, setAlert, modalRef] = useAlertModal();
  const [sak, setSak] = useState<Sak>(contextSak);
  const [testFerdig, setTestFerdig] = useState(false);
  const [testResultsLoeysing, setTestResultsLoeysing] = useState<
    ResultatManuellKontroll[]
  >(getTestResultsForLoeysing(contextTestResults, Number(loeysingId)));

  const [nettsideProperties, setNettsideProperties] = useState(
    getNettsideProperties(contextSak, Number(loeysingId))
  );
  const [pageType, setPageType] = useState<PageType>(
    getInitialPageType(nettsideProperties)
  );
  const [progressionPercent, setProgressionPercent] = useState(
    progressionForLoeysingNettside(
      contextSak,
      contextTestResults,
      pageType.nettsideId,
      innhaldstype,
      Number(loeysingId)
    )
  );
  const [testregelList, setTestregelList] = useState(
    mapTestregelOverviewElements(sak.testreglar, innhaldstype)
  );
  const [testStatusMap, setTestStatusMap] = useState(
    toTestregelStatus(
      testregelList,
      testResultsLoeysing,
      contextSak.id,
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
    contextTestResults: ResultatManuellKontroll[],
    loeysingId: number,
    pageType: PageType,
    innhaldstype: InnhaldstypeTesting,
    activeTestregel?: Testregel
  ) => {
    const testregelList = mapTestregelOverviewElements(
      sak.testreglar,
      innhaldstype
    );

    const testResultsLoeysing = getTestResultsForLoeysing(
      contextTestResults,
      loeysingId
    );

    const filteredNettsideProperties = getNettsideProperties(
      contextSak,
      loeysingId
    );

    setSak(contextSak);
    setTestregelList(testregelList);
    setTestResultsLoeysing(testResultsLoeysing);

    setNettsideProperties(filteredNettsideProperties);
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
        Number(sakId),
        loeysingId,
        pageType.nettsideId
      )
    );

    const finished =
      testResultsLoeysing.length === contextSak.testreglar.length &&
      testResultsLoeysing.every((tr) => tr.status === 'Ferdig');
    setTestFerdig(finished);

    if (activeTestregel) {
      setActiveTest({
        testregel: activeTestregel,
        testResultList: findActiveTestResults(
          testResultsLoeysing,
          Number(sakId),
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
      sakId: Number(sakId),
      loeysingId: numericLoeysingId,
      testregelId: activeTest.testregel.id,
      nettsideId: pageType.nettsideId,
    };
    const alleResultater = await createTestResultat(nyttTestresultat);
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
        const nextPageType = toPageType(nettsideProperties, nettsideIdNumeric);
        setPageType(nextPageType);
        setActiveTest(undefined);
        processData(
          contextSak,
          contextTestResults,
          Number(loeysingId),
          nextPageType,
          innhaldstype
        );
      } else {
        setAlert('danger', 'Kan ikkje byta side', 'Ugylig nettside');
      }
    },
    [
      contextSak,
      contextTestResults,
      loeysingId,
      nettsideProperties,
      innhaldstype,
    ]
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
          contextTestResults,
          Number(loeysingId),
          pageType,
          innhaldstype
        );
      }
    },
    [contextSak, contextTestResults, loeysingId, nettsideProperties, pageType]
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
        const sakIdNumeric = Number(sakId);
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
            contextSak,
            contextTestResults,
            Number(loeysingId),
            pageType,
            innhaldstype,
            nextTestregel
          );
        }
      }
    },
    [sakId, loeysingId, contextSak, contextTestResults, pageType, innhaldstype]
  );

  const onChangeTestregelStatus = useCallback(
    (status: ManuellTestStatus, testregelId: number) => {
      const sakIdNumeric = Number(sak.id);
      const loeysingIdNumeric = Number(loeysingId);

      const testResults = findActiveTestResults(
        testResultsLoeysing,
        sakIdNumeric,
        loeysingIdNumeric,
        testregelId,
        pageType.nettsideId
      );
      const testregel = sak.testreglar.find((tr) => tr.id === testregelId);
      const newStatus = mapStatus(status);

      if (testStatusMap && testregel) {
        if (status === 'under-arbeid' && isNotDefined(testResults)) {
          doCreateTestResult(
            sakIdNumeric,
            loeysingIdNumeric,
            testregel,
            pageType.nettsideId
          );
        } else {
          const notFinished = testResults.filter((tr) =>
            isNotDefined(tr.elementResultat)
          );
          if (status === 'ferdig' && notFinished.length > 0) {
            setAlert(
              'warning',
              `Kan ikkje sette status ${status}`,
              `${notFinished.length} testar er ikkje ferdig i "${testregel.namn}"`
            );
          } else {
            const updatedtestResults: ResultatManuellKontroll[] =
              testResults.map((testResult) => ({
                id: testResult.id,
                sakId: sakIdNumeric,
                loeysingId: loeysingIdNumeric,
                testregelId: testregelId,
                nettsideId: testResult.nettsideId,
                elementOmtale: testResult.elementOmtale,
                elementResultat: testResult.elementResultat,
                elementUtfall: testResult.elementUtfall,
                testVartUtfoert: testResult.testVartUtfoert,
                svar: testResult.svar,
                status: newStatus,
              }));

            doUpdateTestResultStatus(updatedtestResults);
          }
        }
      }
    },
    [sak, testStatusMap, loeysingId, testResultsLoeysing, pageType.nettsideId]
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
          sakId: sakId,
          loeysingId: loeysingId,
          testregelId: activeTestregel.id,
          nettsideId: nettsideId,
        };

        try {
          const createdTestResults = await createTestResultat(testResult);
          contextSetTestResults(createdTestResults);
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
    async (
      resultatId: number,
      alleSvar: Svar[],
      resultat?: TestregelResultat,
      elementOmtale?: string
    ) => {
      const sakIdNumeric = Number(sakId);
      const loeysingIdNumeric = Number(loeysingId);

      const activeTestResult = testResultsLoeysing.find(
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
          sakId: sakIdNumeric,
          loeysingId: loeysingIdNumeric,
          testregelId: activeTest.testregel?.id,
          nettsideId: pageType.nettsideId,
          elementOmtale,
          elementResultat: resultat && toElementResultat(resultat),
          elementUtfall: resultat?.utfall,
          svar: alleSvar,
          status: mapStatus('under-arbeid'),
        };

        try {
          const updatedTestResults = await updateTestResultat(testResult);
          contextSetTestResults(updatedTestResults);
          processData(
            contextSak,
            updatedTestResults,
            loeysingIdNumeric,
            pageType,
            innhaldstype
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
      sakId,
      loeysingId,
      activeTest,
      testResultsLoeysing,
      pageType.nettsideId,
      innhaldstype,
    ]
  );

  const doUpdateTestResultStatus = useCallback(
    async (testResultat: ResultatManuellKontroll[]) => {
      try {
        const updatedTestResults = await updateTestResultatMany(testResultat);
        contextSetTestResults(updatedTestResults);
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
          'Kunne endre status',
          'Oppdatering av status for testresultat feila'
        );
      }
    },
    [contextSak, loeysingId, activeTest, pageType, innhaldstype]
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
        sakName={sak.verksemd.namn}
        currentLoeysingName={sak.loeysingList[0].loeysing.namn}
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
