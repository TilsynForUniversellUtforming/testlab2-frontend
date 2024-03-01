import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import { isDefined, isNotDefined } from '@common/util/validationUtils';
import { Sak } from '@sak/api/types';
import { createTestResultat, updateTestResultat } from '@test/api/testing-api';
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
  findActiveTestResult,
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
import { useCallback, useState } from 'react';
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
  const [alert, setAlert] = useAlert();
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
    const nyttTestresultat: CreateTestResultat = {
      sakId: Number(sakId),
      loeysingId: Number(loeysingId),
      testregelId: activeTest.testregel.id,
      nettsideId: pageType.nettsideId,
    };
    const alleResultater = await createTestResultat(nyttTestresultat);
    const resultater = findActiveTestResults(
      alleResultater,
      Number(sakId),
      Number(loeysingId),
      activeTest.testregel.id,
      pageType.nettsideId
    );
    setActiveTest({ ...activeTest, testResultList: resultater });
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
        setAlert('danger', 'Ugylig nettside');
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
    [contextSak, pageType]
  );

  const onChangeTestregel = useCallback(
    (testregelId: number) => {
      setActiveTest(undefined);
      const nextTestregel = sak.testreglar.find((tr) => tr.id === testregelId);
      if (!nextTestregel) {
        setAlert('danger', 'Det oppstod ein feil ved ending av testregel');
      } else {
        try {
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
        } catch (e) {
          setAlert('danger', 'Ugyldig testregel');
        }
      }
    },
    [sakId, loeysingId, testregelList, contextTestResults, pageType.nettsideId]
  );

  const onChangeStatus = useCallback(
    (status: ManuellTestStatus, testregelId: number) => {
      const sakIdNumeric = Number(sak.id);
      const loeysingIdNumeric = Number(loeysingId);

      const testResult = findActiveTestResult(
        testResultsLoeysing,
        sakIdNumeric,
        loeysingIdNumeric,
        testregelId,
        pageType.nettsideId
      );
      const statusKey = toTestregelStatusKey(
        sakIdNumeric,
        loeysingIdNumeric,
        testregelId,
        pageType.nettsideId
      );
      const testregel = sak.testreglar.find((tr) => tr.id === testregelId);

      if (testStatusMap && testregel) {
        if (status === 'under-arbeid' && isNotDefined(testResult)) {
          doCreateTestResult(
            sakIdNumeric,
            loeysingIdNumeric,
            testregel,
            pageType.nettsideId
          );
        } else if (isDefined(testResult)) {
          const updatedtestResult: ResultatManuellKontroll = {
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
            status: mapStatus(status),
          };

          doUpdateTestResultStatus(updatedtestResult);
          doCheckFinished(
            testResultsLoeysing,
            testResult.id,
            mapStatus(status)
          );
        }

        const updatedMap = new Map(testStatusMap);

        updatedMap.set(statusKey, status);
        setTestStatusMap(updatedMap);
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
          setAlert('danger', 'Opprett testresultat feila');
        }
      } else {
        setAlert('danger', 'Ugyldig oppretting av testresultat');
      }
    },
    [contextSak, loeysingId, activeTest, pageType, innhaldstype]
  );

  const doUpdateTestResult = useCallback(
    async (
      resultatId: number,
      resultat: TestregelResultat,
      elementOmtale: string,
      alleSvar: Svar[]
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
          sakId: Number(sakId),
          loeysingId: Number(loeysingId),
          testregelId: activeTest.testregel?.id,
          nettsideId: pageType.nettsideId,
          elementOmtale,
          elementResultat: toElementResultat(resultat),
          elementUtfall: resultat.utfall,
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
          setAlert('danger', 'Oppdatering av testresultat feila');
        }
      } else {
        setAlert('danger', 'Ugyldig oppdatering av testresultat');
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
    async (testResultat: ResultatManuellKontroll) => {
      try {
        const updatedTestResults = await updateTestResultat(testResultat);
        contextSetTestResults(updatedTestResults);
        processData(
          contextSak,
          updatedTestResults,
          Number(loeysingId),
          pageType,
          innhaldstype
        );
      } catch (e) {
        setAlert('danger', 'Oppdatering av testresultat feila');
      }
    },
    [contextSak, loeysingId, activeTest, pageType, innhaldstype]
  );

  const doCheckFinished = useCallback(
    (
      testResultsLoeysing: ResultatManuellKontroll[],
      updatedResultId: number,
      status: ResultatStatus
    ) => {
      testResultsLoeysing.forEach((tr) => {
        if (tr.id === updatedResultId) {
          tr.status = status;
        }
      });

      const finished = testResultsLoeysing.every(
        (tr) => tr.status === 'Ferdig'
      );
      if (finished) {
        setTestFerdig(true);
      }
    },
    [testResultsLoeysing]
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
          onChangeStatus={onChangeStatus}
          toggleShowHelpText={toggleShowHelpText}
          showHelpText={showHelpText}
        />
      </div>
      {alert && (
        <AlertTimed
          severity={alert.severity}
          message={alert.message}
          clearMessage={alert.clearMessage}
        />
      )}
    </div>
  );
};

export default TestOverviewLoeysing;
