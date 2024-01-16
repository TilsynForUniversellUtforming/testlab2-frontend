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
} from '@test/types';
import { parseTestregel } from '@test/util/testregelParser';
import {
  getInitialPageType,
  getNettsideProperties,
  isAllNonRelevant,
  progressionForLoeysingNettside,
  testResultsForLoeysing,
  toPageType,
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
  const [testStatusMap, setTestStatusMap] = useState(
    toTestregelStatus(testResults)
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
    setTestStatusMap(toTestregelStatus(filteredTestResults));
  }, [contextSak, contextTestResults, loeysingId]);

  const testregelList: TestregelOverviewElement[] = sak.testreglar.map(
    (tr) => ({ id: tr.id, name: tr.name, krav: tr.krav })
  );

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

  const toggleAllNonRelevant = () => {
    setAllNonRelevant((allNonRelevant) => !allNonRelevant); // TODO - TA BORT, oppdater testresulat i api
  };

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
          // TODO - bruk sakId til å finne steg fra testResults
        } catch (e) {
          setAlert('danger', 'Ugyldig testregel');
        }
      }
    },
    [testregelList]
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
              status={testStatusMap.get(tr.id) || 'Ikkje starta'}
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
