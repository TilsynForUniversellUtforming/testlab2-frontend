import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import { isDefined, isNotDefined } from '@common/util/validationUtils';
import { Sak } from '@sak/api/types';
import { createTestResultat, updateTestResultat } from '@test/api/testing-api';
import { CreateTestResultat, ResultatManuellKontroll } from '@test/api/types';
import TestregelButton from '@test/test-overview/loeysing-test/button/TestregelButton';
import TestHeading from '@test/test-overview/loeysing-test/TestHeading';
import TestForm from '@test/testregel-form/TestForm';
import {
  InnhaldsType,
  innhaldsType,
  ManuellTestStatus,
  PageType,
  TestAnswers,
  TestContext,
  TestStep,
} from '@test/types';
import { parseTestregel } from '@test/util/testregelParser';
import {
  combineStepsAndAnswers,
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
import { useOutletContext, useParams } from 'react-router-dom';

import TestRegelParamSelection from './TestRegelParamSelection';

const TestOverviewLoeysing = () => {
  const { id: sakId, loeysingId } = useParams();
  const { contextSak, contextTestResults, contextSetTestResults }: TestContext =
    useOutletContext();
  const [contentType, setContentType] =
    useState<InnhaldsType>('Bilde og grafikk');

  const [activeTestregel, setActiveTestregel] = useState<Testregel>();
  const [testingSteps, setTestingSteps] = useState<Map<string, TestStep>>();
  const [alert, setAlert] = useAlert();
  const [sak, setSak] = useState<Sak>(contextSak);
  const [testResultsLoeysing, setTestResultsLoeysing] = useState<
    ResultatManuellKontroll[]
  >(getTestResultsForLoeysing(contextTestResults, Number(loeysingId)));
  // const [allNonRelevant, setAllNonRelevant] = useState(
  //   isAllNonRelevant(testResultsLoeysing)
  // );
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

  const handleSetTestingSteps = (
    testregel: Testregel,
    testResultsLoeysing: ResultatManuellKontroll[],
    sakId: number,
    loeysingId: number,
    nettsideId: number
  ) => {
    const manualTestregel = parseTestregel(testregel.testregelSchema);
    const testResult = findActiveTestResult(
      testResultsLoeysing,
      sakId,
      loeysingId,
      testregel.id,
      nettsideId
    );

    const testingSteps = combineStepsAndAnswers(
      manualTestregel.steps,
      testResult?.svar
    );

    setTestingSteps(testingSteps);
  };

  const processData = (
    contextSak: Sak,
    contextTestResults: ResultatManuellKontroll[],
    loeysingId: number,
    pageType: PageType,
    activeTestregel?: Testregel
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
    // setAllNonRelevant(isAllNonRelevant(filteredTestResults));
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

    // Set the testing steps if there is an active testregel
    if (isDefined(activeTestregel)) {
      handleSetTestingSteps(
        activeTestregel,
        filteredTestResults,
        Number(sakId),
        loeysingId,
        pageType.nettsideId
      );
    }
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

  // const toggleAllNonRelevant = useCallback(() => {
  //   // TODO - TA BORT, oppdater testresulat i api
  //   const nextToggle = !allNonRelevant;
  //   setAllNonRelevant(nextToggle);
  //   if (nextToggle) {
  //     setTestStatusMap((currentMap) => {
  //       const updatedMap = new Map(currentMap);
  //
  //       updatedMap.forEach((value, key) => {
  //         updatedMap.set(key, 'deaktivert');
  //       });
  //
  //       return updatedMap;
  //     });
  //   }
  //   // TODO - TA BORT
  // }, [allNonRelevant]);

  const onChangeTestregel = useCallback(
    (testregelId: number) => {
      setTestingSteps(undefined);
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
              pageType,
              nextTestregel
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
        testregelId,
        loeysingIdNumeric,
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
        }

        const updatedMap = new Map(testStatusMap);

        updatedMap.set(statusKey, status);
        setTestStatusMap(updatedMap);
        // setAllNonRelevant((prevAllRelevant) =>
        //   prevAllRelevant ? false : prevAllRelevant
        // );
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
            activeTestregel
          );
        } catch (e) {
          setAlert('danger', 'Opprett testresultat feila');
        }
      } else {
        setAlert('danger', 'Ugyldig oppretting av testresultat');
      }
    },
    [contextSak, loeysingId, activeTestregel, pageType]
  );

  const doUpdateTestResult = useCallback(
    async (testAnswers: TestAnswers) => {
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
          elementOmtale: testAnswers.elementOmtale,
          elementResultat: testAnswers.elementResultat,
          elementUtfall: testAnswers.elementUtfall,
          svar: testAnswers.answers,
          ferdig: false,
        };

        try {
          const updatedTestResults = await updateTestResultat(testResult);
          contextSetTestResults(updatedTestResults);
          processData(
            contextSak,
            updatedTestResults,
            loeysingIdNumeric,
            pageType,
            activeTestregel
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
          // allNonRelevant={allNonRelevant}
          // toggleAllNonRelevant={toggleAllNonRelevant}
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
        {testingSteps && activeTestregel && (
          <div className="testregel-form-wrapper">
            <TestForm
              heading={activeTestregel.name}
              steps={testingSteps}
              initStepKey={Array.from(testingSteps.keys())[0]}
              onClickBack={onClickBack}
              onClickSave={onClickSave}
              updateResult={doUpdateTestResult}
            />
          </div>
        )}
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
