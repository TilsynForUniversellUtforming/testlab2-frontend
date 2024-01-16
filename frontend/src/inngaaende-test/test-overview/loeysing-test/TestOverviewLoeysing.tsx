import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import { Sak } from '@sak/api/types';
import TestregelButton from '@test/test-overview/loeysing-test/button/TestregelButton';
import TestHeading from '@test/test-overview/loeysing-test/TestHeading';
import TestForm from '@test/testregel-form/TestForm';
import {
  InnhaldsType,
  innhaldsType,
  ManualTestResult,
  PageType,
  TestContext,
  TestingStep,
  TestregelOverviewElement,
  TestStatus,
} from '@test/types';
import { parseTestregel } from '@test/util/testregelParser';
import {
  getInitialPageType,
  getNettsideProperties,
  isAllNonRelevant,
  progressionForLoeysingNettside,
  testResultsForLoeysing,
  toPageType,
  toTestregelOverviewElement,
  toTestregelStatus,
} from '@test/util/testregelUtils';
import { Testregel } from '@testreglar/api/types';
import { useCallback, useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

import TestRegelParamSelection from './TestRegelParamSelection';

const TestOverviewLoeysing = () => {
  const { loeysingId } = useParams();
  const { sak: contextSak, testResults: contextTestResults }: TestContext =
    useOutletContext();
  const [contentType, setContentType] =
    useState<InnhaldsType>('Bilde og grafikk');

  const [activeTestregel, setActiveTestregel] = useState<Testregel>();
  const [testingSteps, setTestingSteps] = useState<Map<string, TestingStep>>();
  const [alert, setAlert] = useAlert();
  const [sak, setSak] = useState<Sak>(contextSak);
  const [testResults, setTestResults] = useState<ManualTestResult[]>(
    testResultsForLoeysing(contextTestResults)
  );
  const [allNonRelevant, setAllNonRelevant] = useState(
    isAllNonRelevant(testResults)
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

  const testregelList: TestregelOverviewElement[] = sak.testreglar.map((tr) =>
    toTestregelOverviewElement(tr)
  );

  const [testStatusMap, setTestStatusMap] = useState(
    toTestregelStatus(testregelList, testResults)
  );

  useEffect(() => {
    const filteredTestResults = testResultsForLoeysing(contextTestResults);
    const filteredNettsideProperties = getNettsideProperties(
      contextSak,
      loeysingId
    );

    setSak(contextSak);
    setTestResults(filteredTestResults);
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
  }, [contextSak, contextTestResults, loeysingId]);

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
          const parsedTestregel = parseTestregel(nextTestregel.testregelSchema);
          setTestingSteps(parsedTestregel);
          setActiveTestregel(nextTestregel);
        } catch (e) {
          setAlert('danger', 'Ugyldig testregel');
        }
      }
    },
    [testregelList, testResults]
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
