import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import { Sak } from '@sak/api/types';
import { createTestResultat, updateTestResultat } from '@test/api/testing-api';
import { CreateTestResultat, ManualTestResultat } from '@test/api/types';
import TestregelButton from '@test/test-overview/loeysing-test/button/TestregelButton';
import TestHeading from '@test/test-overview/loeysing-test/TestHeading';
import TestForm from '@test/testregel-form/TestForm';
import {
  InnhaldsType,
  innhaldsType,
  PageType,
  TestAnswers,
  TestContext,
  TestStatus,
  TestStep,
} from '@test/types';
import {
  combineStepsAndAnswers,
  parseTestregel,
} from '@test/util/testregelParser';
import {
  findActiveTestResult,
  getInitialPageType,
  getNettsideProperties,
  getTestResultsForLoeysing,
  isAllNonRelevant,
  progressionForLoeysingNettside,
  toPageType,
  toTestregelOverviewElement,
  toTestregelStatus,
} from '@test/util/testregelUtils';
import { Testregel } from '@testreglar/api/types';
import { useCallback, useEffect, useState } from 'react';
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
    ManualTestResultat[]
  >(getTestResultsForLoeysing(contextTestResults, loeysingId));
  const [allNonRelevant, setAllNonRelevant] = useState(
    isAllNonRelevant(testResultsLoeysing)
  );
  const [nettsideProperties, setNettsideProperties] = useState(
    getNettsideProperties(contextSak, loeysingId)
  );
  const [pageType, setPageType] = useState<PageType>(
    getInitialPageType(nettsideProperties)
  );
  const [progressionPercent, setProgressionPercent] = useState(
    progressionForLoeysingNettside(
      contextSak,
      contextTestResults,
      pageType.nettsideId,
      loeysingId
    )
  );
  const [testregelList, setTestregelList] = useState(
    sak.testreglar.map((tr) => toTestregelOverviewElement(tr))
  );
  const [testStatusMap, setTestStatusMap] = useState(
    toTestregelStatus(testregelList, testResultsLoeysing)
  );

  const handleSetTestingSteps = (
    testregel: Testregel,
    testResultsLoeysing: ManualTestResultat[],
    pageType: PageType
  ) => {
    const testregelSteps = parseTestregel(testregel.testregelSchema);
    const testResult = findActiveTestResult(
      testResultsLoeysing,
      pageType.nettsideId,
      testregel.id
    );

    const testingSteps = combineStepsAndAnswers(
      testregelSteps,
      testResult?.svar
    );

    setTestingSteps(testingSteps);
  };

  useEffect(() => {
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
    setAllNonRelevant(isAllNonRelevant(filteredTestResults));
    setNettsideProperties(filteredNettsideProperties);
    setProgressionPercent(
      progressionForLoeysingNettside(
        contextSak,
        filteredTestResults,
        pageType.nettsideId,
        loeysingId
      )
    );
    setTestStatusMap(toTestregelStatus(testregelList, filteredTestResults));
    if (activeTestregel) {
      handleSetTestingSteps(activeTestregel, filteredTestResults, pageType);
    }
  }, [contextSak, contextTestResults, loeysingId, activeTestregel]);

  const onClickSave = () => {
    setActiveTestregel(undefined);
  };

  const onClickBack = () => {
    setActiveTestregel(undefined);
  };

  const onChangePageType = useCallback(
    (pageType?: string) => {
      if (pageType) {
        setPageType(toPageType(nettsideProperties, pageType));
      }
    },
    [nettsideProperties]
  );

  const onChangeContentType = useCallback((contentType?: string) => {
    if (contentType && innhaldsType.includes(contentType)) {
      setContentType(contentType as InnhaldsType);
    }
  }, []);

  const toggleAllNonRelevant = useCallback(() => {
    // TODO - TA BORT, oppdater testresulat i api
    const nextToggle = !allNonRelevant;
    setAllNonRelevant(nextToggle);
    if (nextToggle) {
      setTestStatusMap((currentMap) => {
        const updatedMap = new Map(currentMap);

        updatedMap.forEach((value, key) => {
          updatedMap.set(key, 'deaktivert');
        });

        return updatedMap;
      });
    }
    // TODO - TA BORT
  }, [allNonRelevant]);

  const onChangeTestregel = useCallback(
    (testregelId: number) => {
      setTestingSteps(undefined);
      setActiveTestregel(undefined);
      const nextTestregel = sak.testreglar.find((tr) => tr.id === testregelId);
      if (!nextTestregel) {
        setAlert('danger', 'Det oppstod ein feil ved ending av testregel');
      } else {
        try {
          setActiveTestregel(nextTestregel);
          const testregelStatus = testStatusMap.get(nextTestregel.id);

          if (testregelStatus && testregelStatus === 'ikkje-starta') {
            doCreateTestResult(
              sakId,
              loeysingId,
              testregelId,
              pageType.nettsideId
            );
          }
        } catch (e) {
          setAlert('danger', 'Ugyldig testregel');
        }
      }
    },
    [sakId, loeysingId, testregelList, testResultsLoeysing, pageType.nettsideId]
  );

  const onChangeStatus = useCallback(
    (status: TestStatus, testregelId: number) => {
      // TODO TA BORT - Switch for å gjøre api-kall for å endre status på de ulike testreglene
      const updatedMap = new Map(testStatusMap);
      updatedMap.set(testregelId, status);
      setTestStatusMap(updatedMap);
      setAllNonRelevant((prevAllRelevant) =>
        prevAllRelevant ? false : prevAllRelevant
      );
      // TODO TA BORT
    },
    [testStatusMap]
  );

  // Create test result when the block is opened
  const doCreateTestResult = useCallback(
    async (
      sakId: string | undefined,
      loeysingId: string | undefined,
      testregelId: number | undefined,
      nettsideId: number | undefined
    ) => {
      if (
        !isNaN(Number(sakId)) &&
        !isNaN(Number(loeysingId)) &&
        testregelId &&
        nettsideId
      ) {
        const testResult: CreateTestResultat = {
          sakId: Number(sakId),
          loeysingId: Number(loeysingId),
          testregelId: testregelId,
          nettsideId: nettsideId,
          ikkjeRelevant: false,
        };

        try {
          const createdTestResults = await createTestResultat(testResult);
          contextSetTestResults(createdTestResults);
        } catch (e) {
          setAlert('danger', 'Opprett testresultat feila');
        }
      } else {
        setAlert('danger', 'Ugyldig oppretting av testresultat');
      }
    },
    []
  );

  const doUpdateTestResult = useCallback(
    async (testAnswers: TestAnswers) => {
      console.log('INNE', testResultsLoeysing);
      const testResultId = findActiveTestResult(
        testResultsLoeysing,
        pageType.nettsideId,
        activeTestregel?.id
      );

      if (
        !isNaN(Number(sakId)) &&
        !isNaN(Number(loeysingId)) &&
        activeTestregel &&
        pageType.nettsideId &&
        testResultId
      ) {
        const testResult: ManualTestResultat = {
          id: testResultId.id,
          sakId: Number(sakId),
          loeysingId: Number(loeysingId),
          testregelId: activeTestregel.id,
          nettsideId: pageType.nettsideId,
          elementOmtale: testAnswers.elementOmtale,
          elementResultat: testAnswers.elementResultat,
          elementUtfall: testAnswers.elementUtfall,
          svar: testAnswers.answers,
          ikkjeRelevant: false,
        };

        try {
          const createdTestResults = await updateTestResultat(testResult);
          contextSetTestResults(createdTestResults);
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
          allNonRelevant={allNonRelevant}
          toggleAllNonRelevant={toggleAllNonRelevant}
          progressionPercent={progressionPercent}
        />
        <div className="testregel-container">
          {testregelList.map((tr) => (
            <TestregelButton
              isActive={tr.id === Number(activeTestregel?.id)}
              key={tr.id}
              testregel={tr}
              onClick={onChangeTestregel}
              status={testStatusMap.get(tr.id) || 'ikkje-starta'}
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
