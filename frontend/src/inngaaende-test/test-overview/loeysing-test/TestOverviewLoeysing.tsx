import AlertModal from '@common/alert/AlertModal';
import useAlertModal from '@common/alert/useAlertModal';
import LoeysingTestContent from '@test/test-overview/loeysing-test/LoeysingTestContent';
import LoeysingTestHeading from '@test/test-overview/loeysing-test/LoeysingTestHeading';
import TestFerdig from '@test/test-overview/loeysing-test/TestFerdig';
import { TestContextKontroll, TestOverviewLoaderResponse } from '@test/types';
import { useCallback, useEffect } from 'react';
import { useLoaderData, useOutletContext, useParams } from 'react-router-dom';
import { useTestOverviewState } from '@test/util/useTestOverviewState';

const TestOverviewLoeysing = () => {
  const { testgrunnlagId: testgrunnlagIdParam, loeysingId: loeysingIdParam } =
    useParams();
  const loeysingId = Number(loeysingIdParam);
  const testgrunnlagId = Number(testgrunnlagIdParam);

  const { innhaldstypeList, sideutvalTypeList }: TestContextKontroll =
    useOutletContext();

  const {
    testResultatForLoeysing,
    sideutvalForLoeysing,
    testreglarForLoeysing,
    activeLoeysing,
    kontrollTitle,
    testKeys,
  } = useLoaderData() as TestOverviewLoaderResponse;
  const [alert, setAlert, modalRef] = useAlertModal();

  const {
    innhaldstype,
    pageType,
    activeTest,
    setActiveTest,
    testFerdig,
    progressionPercent,
    testregelListElements,
    testStatusMap,
    showHelpText,
    toggleShowHelpText,
    onChangeSideutval,
    onChangeInnhaldstype,
    pageTypeList,
    doUpdateTestResult,
    onChangeTestregel,
    onChangeTestregelStatus,
    slettTestelement,
    createNewTestResult,
  } = useTestOverviewState({
    testgrunnlagId,
    loeysingId,
    innhaldstypeList,
    sideutvalTypeList,
    testResultatForLoeysing,
    sideutvalForLoeysing,
    testreglarForLoeysing,
    testKeys,
  });

  const handleSetInactiveTest = useCallback(() => {
    setActiveTest(undefined);
  }, []);

  useEffect(() => {
    if (alert) {
      modalRef.current?.showModal();
    }
  }, [alert]);

  const loeysingNamn = activeLoeysing.namn;

  return (
    <div className="manual-test-container">
      <LoeysingTestHeading
        title={kontrollTitle}
        currentLoeysingName={loeysingNamn}
        sideutvalList={pageTypeList}
        sideutval={pageType}
        onChangeSideutval={onChangeSideutval}
        innhaldstypeList={innhaldstypeList}
        innhaldstype={innhaldstype}
        onChangeInnhaldstype={onChangeInnhaldstype}
      />
      {testFerdig && <TestFerdig loeysingNamn={loeysingNamn} />}
      <div className="manual-test-wrapper">
        <div className="manual-test-buttons">
          <LoeysingTestContent
            sideutval={pageType}
            innhaldstype={innhaldstype}
            progressionPercent={progressionPercent}
            testStatusMap={testStatusMap}
            testregelList={testregelListElements}
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
    </div>
  );
};

export default TestOverviewLoeysing;
