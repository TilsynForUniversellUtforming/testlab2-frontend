import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import { isDefined } from '@common/util/validationUtils';
import { Sak } from '@sak/api/types';
import { createTestResultat, updateTestResultat } from '@test/api/testing-api';
import {
  CreateTestResultat,
  ManualElementResultat,
  ManualTestResultat,
  Svar,
} from '@test/api/types';
import TestregelButton from '@test/test-overview/loeysing-test/button/TestregelButton';
import TestHeading from '@test/test-overview/loeysing-test/TestHeading';
import TestForm from '@test/testregel-form/TestForm';
import {
  InnhaldsType,
  innhaldsType,
  PageType,
  TestContext,
  TestregelOverviewElement,
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

  const [isEdit, setIsEdit] = useState(
    isDefined(
      findActiveTestResult(
        testResultsLoeysing,
        pageType.nettsideId,
        activeTestregel?.id
      )
    )
  );

  const testregelList: TestregelOverviewElement[] = sak.testreglar.map((tr) =>
    toTestregelOverviewElement(tr)
  );

  const [testStatusMap, setTestStatusMap] = useState(
    toTestregelStatus(testregelList, testResultsLoeysing)
  );

  useEffect(() => {
    const filteredTestResults = getTestResultsForLoeysing(
      contextTestResults,
      loeysingId
    );
    const filteredNettsideProperties = getNettsideProperties(
      contextSak,
      loeysingId
    );

    setSak(contextSak);
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

    // Check if test result for current test has been created
    const activeTestResult = findActiveTestResult(
      filteredTestResults,
      pageType.nettsideId,
      activeTestregel?.id
    );
    setIsEdit(isDefined(activeTestResult));
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
          const testregelSteps = parseTestregel(nextTestregel.testregelSchema);
          const testResult = testResultsLoeysing.find(
            (tr) => tr.nettsideId === pageType.nettsideId
          );

          const testingSteps = combineStepsAndAnswers(
            testregelSteps,
            testResult?.svar
          );
          setTestingSteps(testingSteps);
          setActiveTestregel(nextTestregel);

          const testregelStatus = testStatusMap.get(nextTestregel.id);

          if (testregelStatus && testregelStatus === 'ikkje-starta') {
            doCreateTestResult();
          }
        } catch (e) {
          setAlert('danger', 'Ugyldig testregel');
        }
      }
    },
    [testregelList, testResultsLoeysing]
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
  const doCreateTestResult = useCallback(async () => {
    if (
      !isNaN(Number(sakId)) &&
      !isNaN(Number(loeysingId)) &&
      activeTestregel &&
      pageType
    ) {
      const testResult: CreateTestResultat = {
        sakId: Number(sakId),
        loeysingId: Number(loeysingId),
        testregelId: activeTestregel.id,
        nettsideId: pageType.nettsideId,
        ikkjeRelevant: false,
      };

      try {
        const createdTestResults = await createTestResultat(testResult);
        contextSetTestResults(createdTestResults);
      } catch (e) {
        setAlert('danger', 'Kunne ikkje opprette testresulat');
      }
    } else {
      setAlert('danger', 'Ugyldig oppretting av testresultat');
    }
  }, [sakId, loeysingId, activeTestregel, pageType.nettsideId]);

  const doUpdateTestResult = useCallback(
    async (
      answers: Svar[],
      elementOmtale?: string,
      elementResultat?: ManualElementResultat,
      elementUtfall?: string
    ) => {
      const testResultId = findActiveTestResult(
        testResultsLoeysing,
        pageType.nettsideId,
        activeTestregel?.id
      );

      if (
        !isNaN(Number(sakId)) &&
        !isNaN(Number(loeysingId)) &&
        activeTestregel &&
        pageType &&
        testResultId
      ) {
        const testResult: ManualTestResultat = {
          id: testResultId.id,
          sakId: Number(sakId),
          loeysingId: Number(loeysingId),
          testregelId: activeTestregel.id,
          nettsideId: pageType.nettsideId,
          elementOmtale: elementOmtale,
          elementResultat: elementResultat,
          elementUtfall: elementUtfall,
          svar: answers,
          ikkjeRelevant: false,
        };

        try {
          const createdTestResults = await updateTestResultat(testResult);
          contextSetTestResults(createdTestResults);
        } catch (e) {
          setAlert('danger', 'Kunne ikkje opprette testresulat');
        }
      } else {
        setAlert('danger', 'Ugyldig oppretting av testresultat');
      }
    },
    [sakId, loeysingId, activeTestregel, pageType.nettsideId]
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
              onChangeTestregel={onChangeTestregel}
              status={testStatusMap.get(tr.id) || 'ikkje-starta'}
              onChangeStatus={onChangeStatus}
            />
          ))}
        </div>
      </div>
      {testingSteps && activeTestregel && (
        <div className="testregel-form-wrapper">
          <TestForm
            heading={activeTestregel.name}
            steps={testingSteps}
            firstStepKey={Array.from(testingSteps.keys())[0]}
            onClickBack={onClickBack}
            onClickSave={onClickSave}
            isEdit={isEdit}
            updateResult={doUpdateTestResult}
          />
        </div>
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
