import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import { getFullPath, idPath, IdReplacement } from '@common/util/routeUtils';
import { asList } from '@common/util/arrayUtils';
import { isDefined, isNotDefined } from '@common/util/validationUtils';
import { Sak } from '@sak/api/types';
import { createTestResultat, updateTestResultat } from '@test/api/testing-api';
import {
  CreateTestResultat,
  ResultatManuellKontroll,
  ResultatStatus,
  Svar,
} from '@test/api/types';
import TestregelButton from '@test/test-overview/loeysing-test/button/TestregelButton';
import TestFerdig from '@test/test-overview/loeysing-test/TestFerdig';
import TestHeading from '@test/test-overview/loeysing-test/TestHeading';
import TestForm from '@test/testregel-form/TestForm';
import {
  InnhaldsType,
  innhaldsType,
  ManuellTestStatus,
  PageType,
  TestContext,
} from '@test/types';
import {
  TestregelResultat,
  toElementResultat,
} from '@test/util/testregelParser';
import {
  findActiveTestResult,
  getInitialPageType,
  getNettsideProperties,
  getTestResultsForLoeysing,
  progressionForLoeysingNettside,
  toPageType,
  toTestregelOverviewElement,
  toTestregelStatus,
  toTestregelStatusKey,
} from '@test/util/testregelUtils';
import { Testregel } from '@testreglar/api/types';
import { useCallback, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import { getTestresultatAggregert } from '../../../resultat/resultat-api';
import { TESTRESULTAT_TESTGRUNNLAG } from '../../../resultat/ResultatRoutes';
import TestRegelParamSelection from './TestRegelParamSelection';

const TestOverviewLoeysing = () => {
  const { id: sakId, loeysingId } = useParams();
  const { contextSak, contextTestResults, contextSetTestResults }: TestContext =
    useOutletContext();
  const [contentType, setContentType] =
    useState<InnhaldsType>('Bilde og grafikk');
  const navigate = useNavigate();

  const [activeTestregel, setActiveTestregel] = useState<Testregel>();
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
      Number(loeysingId)
    )
  );
  const [testregelList, setTestregelList] = useState(
    sak.testreglar.map((tr) => toTestregelOverviewElement(tr))
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

  const processData = (
    contextSak: Sak,
    contextTestResults: ResultatManuellKontroll[],
    loeysingId: number,
    pageType: PageType
  ) => {
    const testregelList = sak.testreglar.map((tr) =>
      toTestregelOverviewElement(tr)
    );

    const filteredTestResults = getTestResultsForLoeysing(
      contextTestResults,
      loeysingId
    );
    const filteredNettsideProperties = getNettsideProperties(
      contextSak,
      loeysingId
    );

    setSak(contextSak);
    setTestregelList(testregelList);
    setTestResultsLoeysing(filteredTestResults);

    setNettsideProperties(filteredNettsideProperties);
    setProgressionPercent(
      progressionForLoeysingNettside(
        contextSak,
        filteredTestResults,
        pageType.nettsideId,
        loeysingId
      )
    );
    setTestStatusMap(
      toTestregelStatus(
        testregelList,
        filteredTestResults,
        Number(sakId),
        loeysingId,
        pageType.nettsideId
      )
    );
  };

  const onClickSave = () => {
    setActiveTestregel(undefined);
  };

  const onClickBack = () => {
    setActiveTestregel(undefined);
  };

  const onChangePageType = useCallback(
    (nettsideId?: string) => {
      const nettsideIdNumeric = Number(nettsideId);
      if (isDefined(nettsideIdNumeric)) {
        const nextPageType = toPageType(nettsideProperties, nettsideIdNumeric);
        setPageType(nextPageType);
        setActiveTestregel(undefined);
        processData(
          contextSak,
          contextTestResults,
          Number(loeysingId),
          nextPageType
        );
      } else {
        setAlert('danger', 'Ugylig nettside');
      }
    },
    [contextSak, contextTestResults, loeysingId, nettsideProperties]
  );

  const onChangeContentType = useCallback((contentType?: string) => {
    if (contentType && innhaldsType.includes(contentType)) {
      setContentType(contentType as InnhaldsType);
      setActiveTestregel(undefined);
    }
  }, []);

  const onChangeTestregel = useCallback(
    (testregelId: number) => {
      setActiveTestregel(undefined);
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
              pageType
            );
          }

          setActiveTestregel(nextTestregel);
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

      console.log(JSON.stringify(testResult));

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
          processData(contextSak, createdTestResults, loeysingId, pageType);
        } catch (e) {
          setAlert('danger', 'Opprett testresultat feila');
        }
      } else {
        setAlert('danger', 'Ugyldig oppretting av testresultat');
      }
    },
    [contextSak, loeysingId, activeTestregel, pageType]
  );

  const onFerdigTest = useCallback(async () => {
    await getTestresultatAggregert(Number(sakId));
    navigate(
      getFullPath(TESTRESULTAT_TESTGRUNNLAG, {
        pathParam: idPath,
        id: sakId,
      } as IdReplacement)
    );
  }, [sakId]);

  const doUpdateTestResult = useCallback(
    async (
      resultat: TestregelResultat,
      elementOmtale: string,
      alleSvar: Svar[]
    ) => {
      const sakIdNumeric = Number(sakId);
      const loeysingIdNumeric = Number(loeysingId);

      const activeTestResult = findActiveTestResult(
        testResultsLoeysing,
        sakIdNumeric,
        loeysingIdNumeric,
        activeTestregel?.id,
        pageType.nettsideId
      );

      if (
        isDefined(sakIdNumeric) &&
        isDefined(loeysingIdNumeric) &&
        activeTestregel &&
        pageType.nettsideId &&
        activeTestResult
      ) {
        const testResult: ResultatManuellKontroll = {
          id: activeTestResult.id,
          sakId: Number(sakId),
          loeysingId: Number(loeysingId),
          testregelId: activeTestregel.id,
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
            pageType
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
      activeTestregel,
      testResultsLoeysing,
      pageType.nettsideId,
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
          pageType
        );
      } catch (e) {
        setAlert('danger', 'Oppdatering av testresultat feila');
      }
    },
    [contextSak, loeysingId, activeTestregel, pageType]
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
        console.log('success', 'Alle testar er ferdige');
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
      <TestHeading
        sakName={sak.verksemd.namn}
        currentLoeysingName={sak.loeysingList[0].loeysing.namn}
        nettsideProperties={nettsideProperties}
        pageType={pageType}
        onChangePageType={onChangePageType}
        contentType={contentType}
        onChangeContentType={onChangeContentType}
      />
      <div className="manual-test-buttons">
        <TestRegelParamSelection
          pageType={pageType.pageType}
          contentType={contentType}
          progressionPercent={progressionPercent}
        />
        <div className="testregel-container">
          {testregelList.map((tr) => (
            <TestregelButton
              isActive={tr.id === Number(activeTestregel?.id)}
              key={tr.id}
              testregel={tr}
              onClick={onChangeTestregel}
              status={
                testStatusMap.get(
                  toTestregelStatusKey(
                    Number(sakId),
                    Number(loeysingId),
                    tr.id,
                    pageType.nettsideId
                  )
                ) || 'ikkje-starta'
              }
              onChangeStatus={onChangeStatus}
            />
          ))}
        </div>
        {activeTestregel && (
          <div className="testregel-form-wrapper">
            <TestForm
              testregel={activeTestregel}
              resultater={asList(
                findActiveTestResult(
                  testResultsLoeysing,
                  Number(sakId),
                  Number(loeysingId),
                  activeTestregel.id,
                  pageType.nettsideId
                )
              )}
              onClickBack={onClickBack}
              onClickSave={onClickSave}
              onResultat={doUpdateTestResult}
            />
          </div>
        )}
      </div>
      {testFerdig && (
        <TestFerdig
          statusFerdig={testFerdig}
          loeysing={sak.loeysingList[0].loeysing.namn}
          onClickResultat={onFerdigTest}
        />
      )}
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
